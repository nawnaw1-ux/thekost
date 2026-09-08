<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\ResidentNeed;
use App\Services\PendingBillSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserNeedController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userNeed = ResidentNeed::with('resident.user', 'item')->get();
        return inertia(
            'Admin/UserNeed/Index',
            [
                'userNeeds' => $userNeed
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
        $messages = [
            'resident_id.required' => 'Penghuni harus diisi.',
            'items_id.required' => 'Item harus diisi.',
            'items_id.array' => 'Item harus berupa array.',
            'items_id.*.required' => 'Setiap item harus diisi.',
        ];

        $request->validate([
            'resident_id' => 'required',
            'items_id' => 'required|array',
            'items_id.*' => 'required',
        ], $messages);

        foreach ($request->items_id as $key => $value) {
            ResidentNeed::create([
                'resident_id' => $request->resident_id,
                'item_id' => $value
            ]);
        }

        // Sinkronisasi tagihan pending penghuni ini terhadap Keperluan terbaru
        $summary = PendingBillSyncService::syncResidentBills((int) $request->resident_id);
        $message = 'Item ditambahkan';
        if ($extra = PendingBillSyncService::describeSummary($summary)) {
            $message .= '. ' . $extra;
        }

        return back()->with('success', $message);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**~
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateNeedResident(Request $request)
    {
        // Validasi data
        $validated = $request->validate([
            'needs' => 'required|array',
            'needs.*.item_id' => 'required|integer|exists:items,id',
            'id_resident' => 'required|integer|exists:residents,id',
        ]);

        // Hapus kebutuhan lama untuk resident ini
        ResidentNeed::where('resident_id', $validated['id_resident'])->delete();

        // Simpan kebutuhan baru
        foreach ($validated['needs'] as $need) {
            ResidentNeed::create([
                'item_id' => $need['item_id'],
                'resident_id' => $validated['id_resident'],
            ]);
        }

        // Sinkronisasi tagihan pending penghuni ini terhadap Keperluan terbaru
        $summary = PendingBillSyncService::syncResidentBills((int) $validated['id_resident']);
        $message = 'Kebutuhan penghuni berhasil diperbarui';
        if ($extra = PendingBillSyncService::describeSummary($summary)) {
            $message .= '. ' . $extra;
        }

        return back()->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $userNeed = ResidentNeed::find($id);

        if ($userNeed) {
            $residentId = $userNeed->resident_id;
            $userNeed->delete();

            // Sinkronisasi tagihan pending penghuni ini (item berkurang)
            $summary = PendingBillSyncService::syncResidentBills((int) $residentId);
            $message = 'item di hapus';
            if ($extra = PendingBillSyncService::describeSummary($summary)) {
                $message .= '. ' . $extra;
            }

            return back()->with('success', $message);
        } else {
            return back()->with('error', 'item gagal di hapus');
        }
    }
}
