<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardingBranch;
use App\Models\RecordTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OutputReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->query('start_date') ?? Carbon::now()->format('Y-m');
        $startOfMonth = Carbon::createFromFormat('Y-m', $startDate)->startOfMonth();
        $endOfMonth = Carbon::createFromFormat('Y-m', $startDate)->endOfMonth();

        $recordPaymentAuto = BoardingBranch::with(['recordTransactions' => function ($query) {
            $query
                ->where('type_record', 'output')
                ->select('id', 'amount', 'description', 'note', 'boarding_branch_id', 'date', 'type', 'type_record');
        }])
            ->where('is_activated', 1)
            ->first();

        $recordPaymentManual = BoardingBranch::with(['recordTransactions' => function ($query) {
            $query
                ->where('type_record', 'output')
                ->select('id', 'amount', 'description', 'note', 'boarding_branch_id', 'date', 'type', 'type_record');
        }])
            ->where('is_activated', 1)
            ->first();

        $recordPaymentAll = BoardingBranch::with(['recordTransactions' => function ($query) {
            $query
                ->where('type_record', 'output')
                ->select('id', 'amount', 'description', 'note', 'boarding_branch_id', 'date', 'type', 'type_record');
        }])
            ->where('is_activated', 1)
            ->first();


        $autoTransactions = $recordPaymentAuto
            ? $recordPaymentAuto->recordTransactions->whereBetween('date', [$startOfMonth, $endOfMonth])->values()
            : [];
        $manualTransactions = $recordPaymentManual
            ? $recordPaymentManual->recordTransactions->whereBetween('date', [$startOfMonth, $endOfMonth])->values()
            : [];
        $allTransactions = $recordPaymentAll
            ? $recordPaymentAll->recordTransactions->whereBetween('date', [$startOfMonth, $endOfMonth])->values()
            : [];
        return inertia('Admin/Report/OutputReport/Index', [
            'startDate' => $startDate,
            'recordPaymentAuto' => $autoTransactions,
            'recordPaymentManual' => $manualTransactions,
            'allTransactions' => $allTransactions
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

        $request->validate(
            [
                'amount' => 'required|numeric',
                'date' => 'required',
                'description' => 'required',
                'note' => 'nullable',
            ],
            [
                'amount.required' => 'Nominal wajib diisi.',
                'amount.numeric' => 'Nominal harus berupa angka.',
                'date.required' => 'Tanggal wajib diisi.',
                'description.required' => 'Deskripsi wajib diisi.',
            ]
        );

        RecordTransaction::create([
            'amount' => $request->amount,
            'boarding_branch_id' => $request->boarding_branch_id,
            'date' => $request->date,
            'type_record' => 'output',
            'description' => $request->description,
            'note' => $request->note
        ]);

        return redirect()->back()->with('success', 'Data berhasil disimpan.');
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
    public function updateRecord(Request $request)
    {
        RecordTransaction::where('id', $request->id)->update([
            'amount' => $request->amount,
            'date' => $request->date,
            'description' => $request->description,
            'note' => $request->note
        ]);

        return redirect()->back()->with('success', 'Data berhasil disimpan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $recordTransaction = RecordTransaction::find($id);

        if ($recordTransaction) {
            $recordTransaction->delete();
            return redirect()->back()->with('success', 'Data berhasil dihapus.');
        }
    }
}
