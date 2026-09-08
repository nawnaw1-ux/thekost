<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\BoardingBranch;
use App\Models\RecordTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $boardingBranch = BoardingBranch::where('is_activated', 1)->first();

        if (!$boardingBranch) {
            return redirect()->route('admin.setup.index')->withErrors(['error' => 'Tidak ada cabang kos yang aktif. Silakan lakukan setup terlebih dahulu.']);
        }

        $rooms = $boardingBranch->rooms;
        $totalRooms = $rooms->count();

        if ($totalRooms === 0) {
            return inertia('Admin/Dashboard/Index', [
                'emptyRooms' => 0,
                'occupiedRooms' => 0,
                'emptyPercentage' => 0,
                'occupiedPercentage' => 0,
            ]);
        }

        $emptyRooms = $rooms->filter(function ($room) {
            return $room->residents->isEmpty();
        })->count();

        $occupiedRooms = $totalRooms - $emptyRooms;
        $emptyPercentage = ($emptyRooms / $totalRooms) * 100;
        $occupiedPercentage = ($occupiedRooms / $totalRooms) * 100;

        $months = [
            "Januari" => ['output' => 0, 'input' => 0],
            "Februari" => ['output' => 0, 'input' => 0],
            "Maret" => ['output' => 0, 'input' => 0],
            "April" => ['output' => 0, 'input' => 0],
            "Mei" => ['output' => 0, 'input' => 0],
            "Juni" => ['output' => 0, 'input' => 0],
            "Juli" => ['output' => 0, 'input' => 0],
            "Agustus" => ['output' => 0, 'input' => 0],
            "September" => ['output' => 0, 'input' => 0],
            "Oktober" => ['output' => 0, 'input' => 0],
            "November" => ['output' => 0, 'input' => 0],
            "Desember" => ['output' => 0, 'input' => 0],
        ];

        // Ambil data dari database (hanya tahun berjalan)
        $currentYear = Carbon::now()->year;

        $data = DB::table('record_transactions')
            ->join('boarding_branches', 'record_transactions.boarding_branch_id', '=', 'boarding_branches.id')
            ->selectRaw('MONTH(record_transactions.date) as month_num, record_transactions.type_record, SUM(record_transactions.amount) as total')
            ->where('record_transactions.status_active', 1)
            ->where('boarding_branches.is_activated', 1)
            ->whereYear('record_transactions.date', $currentYear)
            ->groupBy('month_num', 'record_transactions.type_record')
            ->get();

        // Konversi nomor bulan ke nama bulan Indonesia
        foreach ($data as $row) {
            $monthIndex = (int) $row->month_num;
            $monthName = $this->getIndonesianMonth($monthIndex);

            if ($row->type_record === 'output') {
                $months[$monthName]['output'] = (int) $row->total;
            } elseif ($row->type_record === 'input' || $row->type_record === 'input-punishment') {
                $months[$monthName]['input'] += (int) $row->total; // gunakan += agar menjumlahkan akumulasi
            }
        }
        // Mapping nama bulan Indonesia ke Inggris
        $translatedMonths = [
            "Januari" => "Januari",
            "Februari" => "Februari",
            "Maret" => "Maret",
            "April" => "April",
            "Mei" => "Mei",
            "Juni" => "Juni",
            "Juli" => "Juli",
            "Agustus" => "Agustus",
            "September" => "September",
            "Oktober" => "Oktober",
            "November" => "November",
            "Desember" => "Desember",
        ];

        // Format output akhir
        $formattedOutput = [];

        foreach ($months as $indMonth => $values) {
            $formattedOutput[] = [
                'month' => $translatedMonths[$indMonth],
                'output' => $values['output'],
                'input' => $values['input'],
            ];
        }

        $currentMonth = Carbon::now()->format('Y-m');

        $paidResidents = Bill::where('status', 'lunas')
            ->where('date_pay', 'like', "$currentMonth%")
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })
            ->distinct('resident_id')
            ->count();

        $unpaidResidents = Bill::where(function ($query) {
            $query->where('status', 'belum lunas')
                ->orWhere('status', 'denda');
        })
            ->where('date_invoice', 'like', "$currentMonth%")
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })
            ->whereHas('resident', function ($query) {
                $query->where('status_active', 1);
            })
            ->distinct('resident_id')
            ->count();


        $totalResidents = $paidResidents + $unpaidResidents;

        $percentagePaid = $totalResidents > 0 ? number_format(($paidResidents / $totalResidents) * 100, 1) : 0;
        $percentageUnpaid = $totalResidents > 0 ? number_format(($unpaidResidents / $totalResidents) * 100, 1) : 0;


        $currentMonth = Carbon::now()->format('Y-m'); // Format YYYY-MM

        // Total amount dengan status lunas di bulan ini
        $totalPaid = Bill::whereHas('boardingBranch', function ($query) {
            $query->where('is_activated', 1);
        })
            ->where('status', 'lunas')
            ->where('end_date', 'like', "$currentMonth%")
            ->sum('amount');

        $totalRecordInput = RecordTransaction::whereHas('boardingBranch', function ($query) {
            $query->where('is_activated', 1);
        })
            ->whereIn('type_record', ['input', 'input-punishment'])
            ->where('date', 'like', "$currentMonth%")
            ->sum('amount');

        // Total amount dengan status belum lunas di bulan ini
        $totalUnpaid = Bill::whereHas('boardingBranch', function ($query) {
            $query->where('is_activated', 1);
        })
            ->whereHas('resident', function ($query) {
                $query->where('status_active', 1); // Menambahkan filter resident.status_active
            })
            ->where(function ($query) {
                $query->where('status', 'belum lunas')
                    ->orWhere('status', 'denda');
            })
            ->where('end_date', 'like', "$currentMonth%")
            ->sum('amount');



        // new

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

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

        // Jumlah penghuni unik yang memiliki tagihan bulan ini
        $total = $bills->pluck('resident_id')->unique()->count();

        $lunas = $bills->where('status', 'lunas')->pluck('resident_id')->unique()->count();
        $belumLunas = $bills->where('status', '!=', 'lunas')->pluck('resident_id')->unique()->count();

        $persenLunas = $total > 0 ? round(($lunas / $total) * 100, 2) : 0;
        $persenBelumLunas = $total > 0 ? round(($belumLunas / $total) * 100, 2) : 0;
        
        
        return inertia('Admin/Dashboard/Index', [
            'emptyRooms' => $emptyRooms,
            'occupiedRooms' => $occupiedRooms,
            'emptyPercentage' => round($emptyPercentage, 2),
            'occupiedPercentage' => round($occupiedPercentage, 2),
            'months' => $formattedOutput,
            'paid_residents' => $total - $belumLunas,
            'unpaid_residents' => $total - $lunas,
            'percentagePaid' => $persenLunas,
            'percentageUnpaid' => $persenBelumLunas,
            'totalPaid' => $totalRecordInput,
            'totalUnpaid' => $totalUnpaid
        ]);
    }

    private function getIndonesianMonth($monthNumber)
    {
        $months = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        return $months[$monthNumber] ?? '';
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStatusBranch(Request $request)
    {
        // Temukan cabang berdasarkan ID yang diberikan
        $boardingBranch = BoardingBranch::find($request->id);

        if ($boardingBranch) {
            // Set status cabang yang ditemukan menjadi 1/true
            $boardingBranch->is_activated = true;
            $boardingBranch->save();

            // Set semua cabang lainnya menjadi 0/false
            BoardingBranch::where('id', '!=', $request->id)->update(['is_activated' => false]);

            return back()->with('success', 'Branch status updated successfully.');
        }

        return back()->with('error', 'Branch not found.');
    }

    public function destroy(string $id)
    {
        //
    }
}
