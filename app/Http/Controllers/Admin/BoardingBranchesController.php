<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardingBranch;
use App\Models\Punishment;
use Illuminate\Http\Request;

class BoardingBranchesController extends Controller
{

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
                'name' => 'required',
                'address' => 'required',
                'phone_number' => [
                    'required',
                    'regex:/^(\+62|62|0)8[1-9][0-9]{6,11}$/',
                ],
                'room_qty' => 'required|integer|min:1',
                'punishment' => 'required|numeric',
                'max_day' => 'required|integer|min:1',
                'items' => 'required|array|min:1',
                'items.*.name' => 'required|string',
                'items.*.price' => 'required|numeric',
            ],
            [
                'name.required' => 'Nama kos harus diisi',
                'address.required' => 'Alamat kos harus diisi',
                'phone_number.required' => 'Nomor telepon kos harus diisi',
                'phone_number.regex' => 'Nomor telepon harus berupa angka dan mengikuti format Indonesia',
                'room_qty.required' => 'Jumlah kamar kos harus diisi',
                'room_qty.integer' => 'Jumlah kamar harus berupa angka',
                'punishment.required' => 'Denda harus diisi',
                'punishment.numeric' => 'Denda harus berupa angka',
                'max_day.required' => 'Maksimal hari denda harus diisi',
                'max_day.integer' => 'Maksimal hari denda harus berupa angka',
                'items.required' => 'Item kos harus diisi',
                'items.array' => 'Item kos harus berupa array',
                'items.*.name.required' => 'Nama item wajib diisi',
                'items.*.price.required' => 'Harga item wajib diisi',
                'items.*.price.numeric' => 'Harga item harus berupa angka',
            ]
        );


        $boardingBranch = BoardingBranch::create([
            'name' => $request->name,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'room_qty' => $request->room_qty
        ]);

        foreach ($request->items as $item) {
            \App\Models\Item::create([
                'name' => $item['name'],
                'price' => $item['price'],
                'boarding_branch_id' => $boardingBranch->id
            ]);
        }


        for ($i = 1; $i <= $request->room_qty; $i++) {
            \App\Models\Room::create([
                'number_room' => $i,
                'boarding_branch_id' => $boardingBranch->id
            ]);
        }

        $punishment = Punishment::create([
            'price' => $request->punishment,
            'boarding_branch_id' => $boardingBranch->id,
            'max_day' => $request->max_day
        ]);

        if ($boardingBranch) {
            return back()->with('success', 'Data Cabang Kos berhasil ditambahkan');
        } else {
            return back()->with('error', 'Data Cabang Kos gagal ditambahkan');
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
    public function update(Request $request)
    {
        $request->validate(
            [
                'name' => 'required',
                'address' => 'required',
                'phone_number' => [
                    'required',
                    'regex:/^(\+62|62|0)8[1-9][0-9]{6,11}$/', // Validasi format nomor telepon Indonesia
                ],
            ],
            [
                'name.required' => 'Nama kos harus diisi',
                'address.required' => 'Alamat kos harus diisi',
                'phone_number.required' => 'Nomor telepon kos harus diisi',
                'phone_number.regex' => 'Nomor telepon harus berupa angka dan mengikuti format Indonesia',
            ]
        );


        $boardingBranch = BoardingBranch::find($request->id);

        $boardingBranch->update([
            'name' => $request->name,
            'address' => $request->address,
            'phone_number' => $request->phone_number,
        ]);

        if ($boardingBranch) {
            return back()->with('success', 'Data Cabang Kos berhasil diubah');
        } else {
            return back()->with('error', 'Data Cabang Kos gagal diubah');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
