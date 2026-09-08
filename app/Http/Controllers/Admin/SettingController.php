<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\BoardingBranch;
use App\Models\ContactAdmin;
use App\Models\Punishment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $boardingBranches = BoardingBranch::where('is_activated', 1)->first();
        $punishments = Punishment::with('boardingBranch')
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })
            ->first();
        $totalRoomQty = BoardingBranch::sum('room_qty');
        $bankAccount = BankAccount::first();
        return Inertia::render(
            'Admin/Setting/Index',
            [
                'boardingBranches' => $boardingBranches,
                'punishments' => $punishments,
                'totalRoomQty' => $totalRoomQty,

                'bankAccount' => $bankAccount
            ]
        );
    }

    public function updateBankAccount(Request $request)
    {
        $request->validate([
            'bank_account' => 'required|regex:/^[0-9]+$/',
            'bank_account_name' => 'required|string',
            'bank_type' => 'required|string',
        ]);
        BankAccount::query()->updateOrCreate(
            ['id' => optional(BankAccount::first())->id],
            [
                'bank_account' => $request->bank_account,
                'bank_account_name' => strtoupper($request->bank_account_name),
                'bank_type' => strtoupper($request->bank_type),
            ]
        );

        return back()->with('success', 'Bank account updated successfully');
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
        $boardingBranch = BoardingBranch::findOrFail($id);
        $totalBranches = BoardingBranch::count();
        // Hapus semua relasi terlebih dahulu
        $boardingBranch->residents()->delete();
        $boardingBranch->rooms()->delete();
        $boardingBranch->bills()->delete();
        $boardingBranch->punishments()->delete();
        $boardingBranch->recordTransactions()->delete();
        $boardingBranch->items()->delete();

        // Hapus boarding branch
        $boardingBranch->delete();

        if ($totalBranches == 1) {
            return to_route('admin.setup.index');
        }
        if ($boardingBranch->is_activated) {
            $anotherBranch = BoardingBranch::where('id', '!=', $id)->first();

            if ($anotherBranch) {
                // Aktifkan branch lain sebelum menghapus
                $anotherBranch->update(['is_activated' => 1]);
            }
        }
    }
}
