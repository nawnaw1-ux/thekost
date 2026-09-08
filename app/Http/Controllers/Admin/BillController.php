<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\RecordTransaction;
use App\Models\Resident;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BillController extends Controller
{
    private const PAYMENT_NOTE_PREFIX = 'AUTO_PAYMENT:';
    private const PENALTY_NOTE_PREFIX = 'AUTO_PENALTY:';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $bill = Bill::with('resident.user', 'detailBills')->get();

        $bills = Bill::with(['resident.user', 'detailBills', 'payment'])
            ->get()
            ->where('status_active', 1)
            ->map(function ($bill) {
                if ($bill->date_invoice) {
                    $bill->date_invoice = Carbon::createFromFormat('Y-m-d', $bill->date_invoice)->translatedFormat('d F Y');
                }
                if ($bill->date_pay) {
                    $bill->date_pay = Carbon::createFromFormat('Y-m-d', $bill->date_pay)->translatedFormat('d F Y');
                }
                if ($bill->end_date) {
                    $bill->end_date = Carbon::createFromFormat('Y-m-d', $bill->end_date)->translatedFormat('d F Y');
                }
                $bill->subtotal = $bill->amount + $bill->penalty;
                return $bill;
            });


        $filteredBills = Bill::with(['resident.user', 'detailBills', 'payment'])
            ->get()->where('status_active', 1)
            ->filter(function ($bill) {
                // Compare the raw end_date month with the current month
                if ($bill->end_date) {
                    return Carbon::parse($bill->end_date)->format('F') === Carbon::now()->format('F');
                }
                return false;
            })
            ->map(function ($bill) {
                // Format the dates for display after filtering
                if ($bill->date_invoice) {
                    $bill->date_invoice = Carbon::createFromFormat('Y-m-d', $bill->date_invoice)->translatedFormat('d F Y');
                }
                if ($bill->date_pay) {
                    $bill->date_pay = Carbon::createFromFormat('Y-m-d', $bill->date_pay)->translatedFormat('d F Y');
                }
                if ($bill->end_date) {
                    $bill->end_date = Carbon::createFromFormat('Y-m-d', $bill->end_date)->translatedFormat('d F Y');
                }

                // Calculate subtotal
                $bill->subtotal = $bill->amount + $bill->penalty;

                return $bill;
            })
            ->values();  // Remove numeric keys


        $filteredBills2 = Bill::with(['resident.user', 'detailBills', 'payment'])
            ->get()->where('status_active', 1)
            ->filter(function ($bill) {
                // Compare the raw end_date month with the next month
                if ($bill->end_date) {
                    return Carbon::parse($bill->end_date)->format('F') === Carbon::now()->addMonth()->format('F');
                }
                return false;
            })
            ->map(function ($bill) {
                // Format the dates for display after filtering
                if ($bill->date_invoice) {
                    $bill->date_invoice = Carbon::createFromFormat('Y-m-d', $bill->date_invoice)->translatedFormat('d F Y');
                }
                if ($bill->date_pay) {
                    $bill->date_pay = Carbon::createFromFormat('Y-m-d', $bill->date_pay)->translatedFormat('d F Y');
                }
                if ($bill->end_date) {
                    $bill->end_date = Carbon::createFromFormat('Y-m-d', $bill->end_date)->translatedFormat('d F Y');
                }

                // Calculate subtotal
                $bill->subtotal = $bill->amount + $bill->penalty;

                return $bill;
            })
            ->values();  // Remove numeric keys


        $beforeMonth = Carbon::now()->subMonth()->translatedFormat('F Y');
        $thisMonth = Carbon::now()->translatedFormat('F Y');
        $nextMonth = Carbon::now()->addMonth()->translatedFormat('F Y');

        return inertia(
            'Admin/Bill/Index',
            [
                'bills' => $bills,
                'thisMonth' => $thisMonth,
                'filteredBills' => $filteredBills,
                'nextMonth' => $nextMonth,
                'filteredBills2' => $filteredBills2
            ]
        );
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

        $request->validate(
            [
                'resident_id' => 'required',
                'end_date' => 'required',
            ],
            [
                'resident_id.required' => 'data penghuni wajib diisi',
                'end_date.required' => 'data jatuh tempo pertama wajib diisi',
            ]
        );

        $resident = Resident::find($request->resident_id);
        $needs = $resident->needs()->with('item')->get();

        $amount = $needs->sum('item.price');


        $invoice = 'INV/' . Str::upper($resident->user->surname) . '/' . Carbon::now()->translatedFormat('m/Y');

        $tanggal_h_min_3 = Carbon::parse($request->end_date)->subDays(3);


        $bill = Bill::create([
            'invoice' => $invoice,
            'resident_id' => $request->resident_id,
            'end_date' => $request->end_date,
            'date_invoice' => $tanggal_h_min_3,
            'amount' => $amount,
        ]);

        foreach ($needs as $need) {
            $bill->detailBills()->create([
                'bill_id' => $bill->id,
                'name' => $need->item->name,
                'price' => $need->item->price,
            ]);
        }

        if ($bill) {
            return back()->with('success', 'Tagihan pertama berhasil di buat');
        } else {
            return back()->with('error', 'Tagihan pertama gagal di buat');
        }
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
    public function update(Request $request, string $id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            return back()->with('error', 'Tagihan gagal ditemukan');
        }

        $request->validate([
            'status' => 'required|in:belum lunas,denda,lunas',
            'date_pay' => 'required_if:status,lunas|nullable|date',
            'penalty' => 'required_if:status,denda|nullable|numeric',
            'penalty_day' => 'required_if:status,denda|nullable|numeric',
        ], [
            'date_pay.required_if' => 'Tanggal bayar wajib diisi.',
            'date_pay.date' => 'Tanggal bayar tidak valid.',
            'penalty.required_if' => 'Jumlah denda wajib diisi.',
            'penalty.numeric' => 'Jumlah denda harus berupa angka.',
            'penalty_day.required_if' => 'Hari denda wajib diisi.',
            'penalty_day.numeric' => 'Hari denda harus berupa angka.',
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status yang dipilih tidak valid.',
        ]);

        $bill->status = $request->status;

        if ($request->status === 'lunas') {
            $bill->date_pay = $request->date_pay;
            $bill->penalty = 0;
            $bill->penalty_day = 0;
        }

        if ($request->status === 'denda') {
            $bill->penalty = $request->penalty;
            $bill->penalty_day = $request->penalty_day;
            $bill->date_pay = null;
        }

        if ($request->status === 'belum lunas') {
            $bill->date_pay = null;
            $bill->penalty = 0;
            $bill->penalty_day = 0;
        }

        $bill->save();
        $bill->load('resident.user');

        if ($bill->status === 'lunas') {
            $this->syncIncomeRecords($bill);
        } else {
            $this->removeIncomeRecords($bill);
        }

        return back()->with('success', 'Tagihan berhasil diubah');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $bill = Bill::find($id);

        if ($bill) {
            $bill->status_active = 0;
            $bill->save();
            return back()->with('success', 'Tagihan berhasil di hapus');
        } else {
            return back()->with('error', 'Tagihan gagal di hapus');
        }
    }

    private function syncIncomeRecords(Bill $bill): void
    {
        $residentName = $this->formatResidentName(
            $bill->resident->user->name,
            $bill->resident->user->surname ?? null
        );

        RecordTransaction::updateOrCreate(
            [
                'boarding_branch_id' => $bill->boarding_branch_id,
                'type_record' => 'input',
                'note' => self::PAYMENT_NOTE_PREFIX . $bill->invoice,
            ],
            [
                'amount' => $bill->amount,
                'date' => $bill->date_pay,
                'type' => 'manual',
                'description' => 'Pembayaran ' . $residentName,
            ]
        );

        RecordTransaction::where([
            'boarding_branch_id' => $bill->boarding_branch_id,
            'type_record' => 'input-punishment',
            'note' => self::PENALTY_NOTE_PREFIX . $bill->invoice,
        ])->delete();
    }

    private function formatResidentName(string $name, ?string $surname = null): string
    {
        $name = trim(preg_replace('/\s+/', ' ', $name) ?? $name);
        $surname = trim(preg_replace('/\s+/', ' ', $surname ?? '') ?? '');

        if ($surname === '') {
            return $name;
        }

        if (Str::lower($name) === Str::lower($surname)) {
            return $name;
        }

        if (Str::endsWith(Str::lower($name), ' ' . Str::lower($surname))) {
            return $name;
        }

        return trim($name . ' ' . $surname);
    }

    private function removeIncomeRecords(Bill $bill): void
    {
        RecordTransaction::whereIn('note', [
            self::PAYMENT_NOTE_PREFIX . $bill->invoice,
            self::PENALTY_NOTE_PREFIX . $bill->invoice,
        ])->delete();
    }
}
