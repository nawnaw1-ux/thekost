<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardingBranch;
use App\Models\Item;
use App\Services\PendingBillSyncService;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::whereHas('boardingBranch', function ($query) {
            $query->where('is_activated', 1);
        })->get();

        return inertia(
            'Admin/Item/Index',
            [
                'items' => $items
            ]
        );
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/Item/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(
            [
                'name' => 'required',
                'price' => 'required|numeric',

            ],
            [
                'name.required' => 'nama item wajib diisi',
                'price.required' => 'harga wajib diisi',
                'price.numeric' => 'harga harus berupa angka',
            ]
        );

        $item = Item::create([
            'name' => $request->name,
            'price' => $request->price,
            'boarding_branch_id' => BoardingBranch::where('is_activated', 1)->first()->id
        ]);

        if ($item) {
            return back()->with('success', 'item berhasil ditambahkan');
        } else {
            return back()->with('error', 'item gagal ditambahkan');
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
    public function updateItem(Request $request)
    {

        $item = Item::find($request->id);

        $request->validate(
            [
                'name' => 'required',
                'price' => 'required|numeric',
            ],
            [
                'name.required' => 'nama item wajib diisi',
                'price.required' => 'harga wajib diisi',
                'price.numeric' => 'harga harus berupa angka',
            ]
        );

        if ($item) {
            $item->update([
                'name' => $request->name,
                'price' => $request->price,
            ]);

            // Sinkronisasi tagihan pending semua penghuni yang memakai
            // item ini (termasuk harga kamar) terhadap harga terbaru.
            // Bill lunas / telat / ber-link-Xendit-aktif otomatis di-skip.
            $summary = PendingBillSyncService::syncBillsForItem((int) $item->id);
            $message = 'item berhasil diupdate';
            if ($extra = PendingBillSyncService::describeSummary($summary)) {
                $message .= '. ' . $extra;
            }

            return back()->with('success', $message);
        } else {
            return back()->with('error', 'item gagal diupdate');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * Validasi: item hanya bisa dihapus jika TIDAK ada penghuni AKTIF
     * yang masih memakainya. Penghuni aktif = residents.status_active=1
     * DAN users.status_active=1 (sama persis definisinya dengan daftar
     * penghuni di ResidentController::index).
     * Keperluan dari penghuni yang sudah nonaktif/terhapus tidak memblokir.
     */
    public function destroy(string $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return back()->with('error', 'item tidak ditemukan');
        }

        $activeNeedsCount = $item->needs()->whereHas('resident', function ($query) {
            $query->where('status_active', 1)
                ->whereHas('user', function ($q) {
                    $q->where('status_active', 1);
                });
        })->count();

        if ($activeNeedsCount == 0) {
            // Aman dihapus. Bersihkan juga resident_needs yatim (milik
            // penghuni nonaktif/terhapus) supaya tidak ada data menggantung.
            $item->needs()->delete();
            $item->delete();
            return back()->with('success', 'item berhasil dihapus');
        }

        return back()->with('error', 'item gagal dihapus, masih terkait di keperluan penghuni kos');
    }
}
