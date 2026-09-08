<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Bill, BoardingBranch, RecordTransaction, Resident, Room};
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date') ?? Carbon::now()->format('Y-m');
        $startOfMonth = Carbon::createFromFormat('Y-m', $startDate)->startOfMonth();
        $endOfMonth = Carbon::createFromFormat('Y-m', $startDate)->endOfMonth();
        $now = Carbon::now()->startOfMonth();

        $occupied = 0;
        $empty = 0;
        $totalRoomStatus = 0;

        if ($startOfMonth->greaterThan($now)) {
            $occupied = 0;
            $empty = 0;
            $totalRoomStatus = 0;
        } else {
            $rooms = Room::whereHas('boardingBranch', fn($q) => $q->where('is_activated', true))
                ->with('residents')
                ->get();

            $hasAnyResidentThisMonth = false;

            foreach ($rooms as $room) {
                $activeResidents = $room->residents->filter(function ($resident) use ($startOfMonth, $endOfMonth) {
                    $tanggalMasuk = Carbon::parse($resident->tanggal_masuk);
                    $tanggalKeluar = $resident->tanggal_keluar ? Carbon::parse($resident->tanggal_keluar) : null;

                    return $tanggalMasuk->lte($endOfMonth) &&
                        (is_null($tanggalKeluar) || $tanggalKeluar->gte($startOfMonth));
                });

                if ($activeResidents->isNotEmpty()) {
                    $occupied++;
                    $hasAnyResidentThisMonth = true;
                } else {
                    $empty++;
                }
            }

            if (!$hasAnyResidentThisMonth) {
                $occupied = 0;
                $empty = 0;
            }

            $totalRoomStatus = $occupied + $empty;
        }

        // Session sync
        $latestBoardingBranchUpdatedAt = BoardingBranch::where('is_activated', true)->max('updated_at');
        if (session('boarding_branch_last_update') != $latestBoardingBranchUpdatedAt) {
            session()->forget(['monthly_data', 'resident_data']);
            session(['boarding_branch_last_update' => $latestBoardingBranchUpdatedAt]);
        }

        // Session values
        $result = session('result', []);
        $residentData = session('resident_data', []);

        $input_records = session('input_records', []);
        $output_records = session('output_records', []);
        $monthlyData = session('monthly_data', []);
        $formatted_data = session('formatted_data', []);

        // Record transactions
        $recordPaymentInput = RecordTransaction::with('boardingBranch')
            ->whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->where('type_record', 'input')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $recordPaymentPunishmentInput = RecordTransaction::with('boardingBranch')
            ->whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->where('type_record', 'input-punishment')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $recordPaymentOutput = RecordTransaction::with('boardingBranch')
            ->whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->where('type_record', 'output')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $totalInputAmount = $recordPaymentInput->sum('amount');
        $totalInputPunishmentAmount = $recordPaymentPunishmentInput->sum('amount');
        $totalOutputAmount = $recordPaymentOutput->sum('amount');

        // Get boarding branch with rooms and residents
        $boardingBranch = BoardingBranch::where('is_activated', true)
            ->with(['rooms.residents'])
            ->first();

        if (!$boardingBranch) {
            return response()->json(['message' => 'No active boarding branch found'], 404);
        }

        $date = Carbon::createFromFormat('Y-m', $startDate);
        $month = $date->month;
        $year = $date->year;

        $rooms = Room::whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))->get();
        $totalRooms = $rooms->count();

        $occupiedRooms = 0;
        $emptyRooms = $totalRooms;

        $latestEntry = Resident::max('tanggal_masuk');

        if ($latestEntry) {
            $latestEntryDate = Carbon::parse($latestEntry);

            if ($date->lessThanOrEqualTo($latestEntryDate->copy()->endOfMonth())) {
                $residents = Resident::whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
                    ->whereDate('tanggal_masuk', '<=', $date->copy()->endOfMonth())
                    ->where(function ($query) use ($date) {
                        $query->whereNull('tanggal_keluar')
                            ->orWhereDate('tanggal_keluar', '>=', $date->copy()->startOfMonth());
                    })
                    ->get();

                $validResidents = $residents->filter(function ($resident) use ($date) {
                    $unpaidBillExists = $resident->bills()
                        ->whereMonth('end_date', $date->month)
                        ->whereYear('end_date', $date->year)
                        ->whereIn('status', ['belum lunas', 'denda'])
                        ->exists();

                    $paidBillExists = $resident->bills()
                        ->whereMonth('end_date', $date->month)
                        ->whereYear('end_date', $date->year)
                        ->where('status', 'lunas')
                        ->exists();

                    if ($resident->status_active == 1) {
                        // Aktif → terhitung meski belum lunas/denda
                        return true;
                    }

                    if ($resident->status_active == 0 && $paidBillExists && !$unpaidBillExists) {
                        // Tidak aktif tapi sudah lunas → tetap dihitung
                        return true;
                    }

                    // Tidak aktif + belum lunas/denda → tidak dihitung
                    return false;
                });

                $occupiedRooms = $validResidents->pluck('room_id')->unique()->count();
                $emptyRooms = $totalRooms - $occupiedRooms;
            }
        }

        $resultBoardingBranch = [
            'boarding_branch' => $boardingBranch->name,
            'total_rooms' => $totalRooms,
            'occupied_rooms' => $occupiedRooms,
            'empty_rooms' => $emptyRooms,
        ];

        // Paid & unpaid residents
        $paidResidents = Bill::where('status', 'lunas')
            ->where('status_active', 1)
            ->whereBetween('date_pay', [$startOfMonth, $endOfMonth])
            ->whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->distinct('resident_id')
            ->count();

        $unpaidResidents = Bill::where(fn($q) =>
        $q->where('status', 'belum lunas')->orWhere('status', 'denda')->where('status_active', 1))
            ->whereBetween('date_invoice', [$startOfMonth, $endOfMonth])
            ->whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->whereHas('resident', fn($q) => $q->where('status_active', 1))
            ->distinct('resident_id')
            ->count();

        // Grouped by year
        $groupedResidentYear = Resident::selectRaw('YEAR(created_at) as year')
            ->where('status_active', 1)
            ->groupBy('year')
            ->get();

        $groupedRecordTransaction = RecordTransaction::selectRaw('YEAR(created_at) as year')
            ->groupBy('year')
            ->get();

        $bills = Bill::with('resident')
            ->where('status_active', 1) // hanya Bill aktif
            ->whereBetween('end_date', [$startOfMonth, $endOfMonth])
            ->whereHas('resident', function ($query) {
                $query->where('status_active', 1); // hanya Resident aktif
            })
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1); // hanya BoardingBranch aktif
            })
            ->get();

        $total = $bills->pluck('resident_id')->unique()->count();

        $lunas = $bills->where('status', 'lunas')->pluck('resident_id')->unique()->count();
        $belumLunas = $bills->where('status', '!=', 'lunas')->pluck('resident_id')->unique()->count();

        return inertia('Admin/Report/Index', [
            'recordPaymentInput' => $recordPaymentInput,
            'recordPaymentOutput' => $recordPaymentOutput,
            'totalInputPunishmentAmount' => $totalInputPunishmentAmount,
            'totalInputAmount' => $totalInputAmount,
            'totalOutputAmount' => $totalOutputAmount,
            'startDate' => $startDate,
            'residentData' => $residentData,
            'input_records' => $input_records,
            'result' => $result,
            'boardingBranch' => $resultBoardingBranch,
            'output_records' => $output_records,
            'formatted_data' => $formatted_data,
            'monthlyData' => $monthlyData,
            'paidResidents' => $total - $belumLunas,
            'unpaidResidents' => $total - $lunas,
            'groupedResidentYear' => $groupedResidentYear,
            'groupedRecordTransaction' => $groupedRecordTransaction,
            'total_rooms' => $totalRoomStatus,
            'occupied_rooms' => $occupied,
            'empty_rooms' => $empty,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date_format:Y-m',
        ]);

        return redirect()->route('admin.report.index', [
            'start_date' => $validated['start_date'],
        ]);
    }


    public function monthlyReport(Request $request)
    {
        $monthRange = $request->monthRange;
        $year = $request->year;

        $startMonth = $monthRange === 'Juli - Desember' ? 7 : 1;
        $endMonth = $monthRange === 'Juli - Desember' ? 12 : 6;

        $monthlyData = [];

        Carbon::setLocale('id'); // Set locale ke Bahasa Indonesia

        for ($month = $startMonth; $month <= $endMonth; $month++) {
            // Gabungkan 'input' dan 'input-punishment'
            $recordPaymentInput = RecordTransaction::whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
                ->whereIn('type_record', ['input', 'input-punishment'])
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->get();

            $recordPaymentOutput = RecordTransaction::whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
                ->where('type_record', 'output')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->get();

            $monthlyData[] = [
                'month' => Carbon::create()->month($month)->translatedFormat('F'),
                'totalInput' => $recordPaymentInput->sum('amount'),
                'totalOutput' => $recordPaymentOutput->sum('amount'),
            ];
        }

        session(['monthly_data' => $monthlyData]);

        // return redirect()->route('admin.report.index');
    }



    public function downloadExcel(Request $request)
    {
        $year = $request->query('year');

        $transactions = RecordTransaction::whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->whereYear('date', $year)
            ->get();

        $months = [
            'januari',
            'februari',
            'maret',
            'april',
            'mei',
            'juni',
            'juli',
            'agustus',
            'september',
            'oktober',
            'november',
            'desember'
        ];

        $groupedTransactions = $transactions->groupBy(function ($transaction) {
            return strtolower(Carbon::parse($transaction->date)->translatedFormat('F'));
        });

        $formattedData = collect($months)->map(function ($month) use ($groupedTransactions) {
            $monthTransactions = collect($groupedTransactions[$month] ?? []);
            $pemasukkan = $monthTransactions->where('type_record', 'input');
            $pengeluaran = $monthTransactions->where('type_record', 'output');

            return [
                'month' => ucfirst($month),
                'input' => $pemasukkan->sum('amount'),
                'output' => $pengeluaran->sum('amount'),
            ];
        });

        return response()->json($formattedData->values()->toArray());
    }

    public function downloadExcelMonthly(Request $request)
    {
        $start_date = Carbon::createFromFormat('Y-m', $request->start_date)->startOfMonth()->toDateString();
        $end_date = Carbon::createFromFormat('Y-m', $request->start_date)->endOfMonth()->toDateString();

        $transactions = RecordTransaction::whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
            ->whereBetween('date', [$start_date, $end_date])
            ->get();

        $income = $transactions->where('type_record', 'input');
        $expense = $transactions->where('type_record', 'output');

        $result = [
            'pemasukkan' => [
                'total' => $income->sum('amount'),
                'details' => $income->values()
            ],
            'pengeluaran' => [
                'total' => $expense->sum('amount'),
                'details' => $expense->values()
            ],
            'keuntungan' => $income->sum('amount') - $expense->sum('amount')
        ];

        session(['result' => $result]);

        return redirect()->route('admin.report.index');
    }

    public function okupansiResident(Request $request)
    {
        $monthRange = $request->input('monthRange');
        $year = $request->input('year');

        $startMonth = $monthRange === 'Juli - Desember' ? 7 : 1;
        $endMonth = $monthRange === 'Juli - Desember' ? 12 : 6;

        $residentData = [];

        Carbon::setLocale('id'); // Set locale ke Bahasa Indonesia

        $now = Carbon::now();

        for ($month = $startMonth; $month <= $endMonth; $month++) {
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            // Jika bulan di masa depan, set count = 0
            if ($year > $now->year || ($year == $now->year && $month > $now->month)) {
                $residentCount = 0;
            } else {
                $residentCount = Resident::where('status_active', 1)
                    ->whereHas('boardingBranch', fn($q) => $q->where('is_activated', 1))
                    ->whereDate('tanggal_masuk', '<=', $endDate)
                    ->where(function ($query) use ($startDate) {
                        $query->whereNull('tanggal_keluar')
                            ->orWhereDate('tanggal_keluar', '>=', $startDate);
                    })
                    ->count();
            }

            $residentData[] = [
                'month' => $startDate->translatedFormat('F'),
                'residentCount' => $residentCount
            ];
        }

        session(['resident_data' => $residentData]);
    }
}
