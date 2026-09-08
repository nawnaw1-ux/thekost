<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RecordTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class DownloadMonthlyDataController extends Controller
{
    private function formatNote(?string $note): ?string
    {
        if (!$note || str_starts_with($note, 'AUTO_PAYMENT:')) {
            return null;
        }

        return $note;
    }

    public function download(Request $request)
    {
        $startDate = Carbon::createFromFormat('Y-m', $request->start_date)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $transactions = RecordTransaction::whereHas('boardingBranch', function ($query) {
            $query->where('is_activated', 1);
        })
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->orderBy('date', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        // Group berdasarkan bulan (format: YYYY-MM)
        $grouped = $transactions->groupBy(function ($item) {
            return Carbon::parse($item->date)->format('Y-m');
        });

        $formatted = $grouped->map(function ($items, $month) {
            $carbonMonth = Carbon::createFromFormat('Y-m', $month);
            $namaBulan = strtoupper($carbonMonth->translatedFormat('F'));

            $pemasukkan = $items->where('type_record', 'input')->sortBy('date')->values()->map(function ($item) {
                return [
                    'tanggal' => Carbon::parse($item->date)->format('j'),
                    'tanggal_sort' => Carbon::parse($item->date)->format('Y-m-d'),
                    'jenis' => $item->description,
                    'jumlah' => $item->amount,
                    'keterangan' => $this->formatNote($item->note)
                ];
            })->values();

            $pengeluaran = $items->where('type_record', 'output')->sortBy('date')->values()->map(function ($item) {
                return [
                    'tanggal' => Carbon::parse($item->date)->format('j'),
                    'tanggal_sort' => Carbon::parse($item->date)->format('Y-m-d'),
                    'jenis' => $item->description,
                    'jumlah' => $item->amount,
                    'keterangan' => $this->formatNote($item->note)
                ];
            })->values();

            $pemasukan_denda = $items->where('type_record', 'input-punishment')->sortBy('date')->values()->map(function ($item) {
                return [
                    'tanggal' => Carbon::parse($item->date)->format('j'),
                    'tanggal_sort' => Carbon::parse($item->date)->format('Y-m-d'),
                    'jenis' => $item->description,
                    'jumlah' => $item->amount,
                    'keterangan' => $this->formatNote($item->note)
                ];
            })->values();

            return [
                'periode' => $namaBulan,
                'tahun' => $carbonMonth->year,
                'pemasukkan' => $pemasukkan,
                'pengeluaran' => $pengeluaran,
                'pemasukan_denda' => $pemasukan_denda,
                'keuntungan' => ($pemasukkan->sum('jumlah') + $pemasukan_denda->sum('jumlah')) - $pengeluaran->sum('jumlah'),
            ];
        })->values();

        $formattedArray = $formatted->toArray();

        $pdf = Pdf::loadView('report.month', ['data' => $formattedArray])->setPaper('a4', 'landscape');
        return $pdf->stream('laporan-keuangan.pdf');
    }
}
