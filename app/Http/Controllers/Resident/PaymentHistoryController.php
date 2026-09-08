<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resident = Auth::user()->resident;

        $bill = Bill::with(['detailBills', 'payment', 'resident.user'])
            ->where('resident_id', $resident->id)
            ->where('status', 'lunas')
            ->get()
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
                return $bill;
            });;

        return inertia(
            'Resident/PaymentHistory/Index',
            [
                'bills' => $bill
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
