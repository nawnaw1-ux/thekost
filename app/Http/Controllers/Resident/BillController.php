<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\Bill;
use App\Models\Resident;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BillController extends Controller
{
    protected function enrichBill(Bill $bill): Bill
    {
        $bill->ensurePaymentCode();

        if ($bill->end_date) {
            $bill->end_date = Carbon::createFromFormat('Y-m-d', $bill->end_date)->translatedFormat('d F Y');
        }

        return $bill;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $auth = Auth::user();

        // Ambil data resident dengan bills yang belum lunas dan date_invoice >= hari ini
        $resident = Resident::with(['bills' => function ($query) {
            $query->where('status', '!=', 'lunas');
        }, 'bills.detailBills', 'bills.payment', 'needs'])
            ->where('user_id', $auth->id)
            ->first();

        if ($resident && $resident->bills) {
            $resident->bills = $resident->bills->map(
                fn(Bill $bill) => $this->enrichBill($bill)
            );
        }
        $bankAccount = BankAccount::first();

        return inertia('Resident/Bill/Index', [
            'resident' => $resident,
            'bankAccount' => $bankAccount,
        ]);
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
        $user = Auth::user();

        $resident = Resident::where('user_id', $user->id)->firstOrFail();
        $bill = Bill::with(['detailBills', 'boardingBranch'])
            ->where('resident_id', $resident->id)
            ->where('status', '!=', 'lunas')
            ->findOrFail($id);

        $bankAccount = BankAccount::first();
        $bill = $this->enrichBill($bill);

        return inertia('Resident/Bill/Show', [
            'bill' => $bill,
            'bankAccount' => $bankAccount,
        ]);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
