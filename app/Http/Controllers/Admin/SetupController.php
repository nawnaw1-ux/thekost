<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\BoardingBranch;
use App\Models\BoardingService;
use App\Models\Item;
use App\Models\Punishment;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SetupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $branchService = BoardingService::first();
        return inertia(
            'Admin/Setup/Index',
            [
                'branchService' => $branchService
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
        $boardingService = BoardingService::first();

        $request->validate([
            'name_branch' => 'required|string',
            'room_qty_branch' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($boardingService) {
                    if ($boardingService && $value > $boardingService->room_qty) {
                        $fail('Tidak bisa karena maksimal ' . $boardingService->room_qty);
                    }
                },
            ],
            'address_branch' => 'required|string',
            'phone_branch' => 'required|string',
            'punishment' => 'required|string',
            'date_punishment' => 'required',
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'bank_account' => 'required|string',
            'bank_account_name' => 'required|string',
            'bank_type' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            // Cek jika nama cabang sudah ada (bisa diganti field lain jika perlu)
            if (BoardingBranch::where('name', $request->name_branch)->exists()) {
                return back()->with('error', 'Cabang dengan nama tersebut sudah ada.');
            }

            $boardingBranch = BoardingBranch::create([
                'name' => $request->name_branch,
                'address' => $request->address_branch,
                'phone_number' => $request->phone_branch,
                'room_qty' => $request->room_qty_branch,
                'is_activated' => true,
            ]);

            BankAccount::create([
                'bank_account' => $request->bank_account,
                'bank_account_name' => strtoupper($request->bank_account_name),
                'bank_type' => strtoupper($request->bank_type),
            ]);

            for ($i = 1; $i <= $request->room_qty_branch; $i++) {
                Room::create([
                    'number_room' => $i,
                    'boarding_branch_id' => $boardingBranch->id
                ]);
            }

            $punishment = Punishment::create([
                'price' => $request->punishment,
                'boarding_branch_id' => $boardingBranch->id,
                'max_day' => $request->date_punishment
            ]);

            foreach ($request['items'] as $item) {
                Item::create([
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'boarding_branch_id' => $boardingBranch->id
                ]);
            }

            DB::commit();

            return redirect()->route('admin.dashboard.index')->with('success', 'Data berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.dashboard.index')->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
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
