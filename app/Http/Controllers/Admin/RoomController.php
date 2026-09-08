<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BoardingBranch;
use App\Models\BoardingService;
use App\Models\Resident;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $boardingBranch = BoardingBranch::with([
            'rooms.residents.user',
            'rooms.residents.needs.item',

        ])
            ->where('is_activated', 1)
            ->first();
        $totalRoomQty = BoardingBranch::sum('room_qty');
        $rooms = $boardingBranch
            ? $boardingBranch->rooms()->orderByRaw('CAST(number_room AS UNSIGNED) ASC')->get()
            : collect();


        $formattedRooms = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'number_room' => $room->number_room,
                'boarding_branch_id' => $room->boarding_branch_id,
                'item' => $room->item,
                'total_bill' => $room->total_bill,
                'created_at' => $room->created_at,
                'updated_at' => $room->updated_at,
                'residents' => $room->residents->where('status_active', 1)->map(function ($resident) {
                    return [
                        'id' => $resident->id,
                        'user_id' => $resident->user_id,
                        'phone_number' => $resident->phone_number,
                        'gender' => $resident->gender,
                        'number_plate' => $resident->number_plate,
                        'boarding_branch_id' => $resident->boarding_branch_id,
                        'room_id' => $resident->room_id,
                        'created_at' => $resident->created_at,
                        'updated_at' => $resident->updated_at,
                        'user' => [
                            'id' => $resident->user->id,
                            'name' => $resident->user->name,
                            'surname' => $resident->user->surname,
                            'email' => $resident->user->email,
                            'email_verified_at' => $resident->user->email_verified_at,
                            'copy_password' => $resident->user->copy_password,
                            'role' => $resident->user->role,
                            'created_at' => $resident->user->created_at,
                            'updated_at' => $resident->user->updated_at,
                        ],
                        'needs' => $resident->needs->map(function ($need) {
                            return [
                                'id' => $need->id,
                                'resident_id' => $need->resident_id,
                                'item_id' => $need->item_id,
                                'created_at' => $need->created_at,
                                'updated_at' => $need->updated_at,
                                'item' => [
                                    'id' => $need->item->id,
                                    'name' => $need->item->name,
                                    'price' => $need->item->price,
                                    'created_at' => $need->item->created_at,
                                    'updated_at' => $need->item->updated_at,
                                ],
                            ];
                        }),
                    ];
                }),


            ];
        });

        return inertia('Admin/Room/Index', [
            'rooms' => $formattedRooms,
            'totalRoomQty' => $totalRoomQty
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
        $request->validate([
            'number_room' => 'required|string',
            'boarding_branch_id' => 'required|integer',
            'item' => 'required|array|min:1', // item harus array dan minimal 1 elemen
            'item.*.id' => 'required|integer', // Validasi setiap elemen item
            'resident_1' => 'required|integer', // Penghuni 1 wajib
            'resident_2' => 'nullable|integer', // Penghuni 2 opsional
        ], [
            'item.required' => 'Keperluan harus dipilih minimal satu.',
            'item.min' => 'Keperluan harus dipilih minimal satu.',
            'resident_1.required' => 'Penghuni 1 wajib diisi.',
        ]);

        $total_bills = collect($request->item)->sum(function ($item) {
            return $item['price'];
        });
        if ($request->resident_1 && $request->resident_2 && $request->resident_1 == $request->resident_2) {
            return back()->withErrors([
                'resident_2' => 'Penghuni 2 tidak boleh sama dengan Penghuni 1.',
            ])->withInput();
        }

        if ($request->resident_1) {
            $resident1 = Resident::find($request->resident_1);

            $resident1->update([
                'room_id' => $request->number_room,
            ]);
        }

        if ($request->resident_2) {
            $resident2 = Resident::find($request->resident_2);

            $resident2->update([
                'room_id' => $request->number_room,
            ]);
        }

        $roomFind = Room::where('boarding_branch_id', $request->boarding_branch_id)->where('number_room', $request->number_room)->first();

        if ($roomFind) {
            $roomFind->update([
                'total_bill' => $total_bills,
                'item' => $request->item,
            ]);
        }


        return back()->with('success', 'room berhasil ditambahkan');
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

    public function addRoom(Request $request)
    {
        try {
            $boardingBranchActive = BoardingBranch::where('is_activated', 1)->first();
            $boardingService = BoardingService::first();

            if (!$boardingBranchActive) {
                return back()->with('error', 'Tidak ada cabang boarding yang aktif');
            }

            // Hitung jumlah kamar yang sudah ada
            $currentRoomCount = Room::where('boarding_branch_id', $boardingBranchActive->id)->count();

            // Ambil kapasitas maksimum dari BoardingService
            $maxRoomQty = $boardingService->room_qty;

            // Validasi apakah jumlah kamar sudah mencapai batas
            if ($currentRoomCount >= $maxRoomQty) {
                return back()->with('error', 'Jumlah kamar sudah mencapai kapasitas maksimum (' . $maxRoomQty . ').');
            }

            $existingRoomNumbers = Room::where('boarding_branch_id', $boardingBranchActive->id)
                ->orderBy('number_room')
                ->pluck('number_room')
                ->toArray();

            // Cari nomor kamar terkecil yang belum digunakan
            $newRoomNumber = 1;
            while (in_array($newRoomNumber, $existingRoomNumbers)) {
                $newRoomNumber++;
            }

            // Simpan data baru
            $room = Room::create([
                'number_room' => $newRoomNumber,
                'boarding_branch_id' => $boardingBranchActive->id,
            ]);

            // Update jumlah room_qty di BoardingBranch
            $boardingBranchActive->increment('room_qty');

            return back()->with('success', 'Kamar berhasil ditambahkan dengan nomor ' . ($newRoomNumber));
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function deleteUserInRoom(Request $request)
    {
        $resident = Resident::find($request->id);

        if ($resident) {
            $resident->update([
                'room_id' => null,
            ]);
            return back()->with('success', 'Penghuni berhasil dihapus');
        } else {
            return back()->with('error', 'Penghuni tidak ditemukan');
        }
    }

    public function addUserInRoom(Request $request)
    {
        $resident = Resident::find($request->resident_id);

        if ($resident) {
            $resident->update([
                'room_id' => $request->room_id,
            ]);
            return back()->with('success', 'Penghuni berhasil ditambahkan');
        } else {
            return back()->with('error', 'Penghuni tidak ditemukan');
        }
    }

    public function editRoom(Request $request)
    {
        $room = Room::find($request->id);

        if (!$room) {
            return back()->with('error', 'Kamar tidak ditemukan');
        }

        // Cek apakah number_room baru sudah digunakan di boarding branch yang sama (kecuali untuk kamar itu sendiri)
        $isDuplicate = Room::where('boarding_branch_id', $room->boarding_branch_id)
            ->where('number_room', $request->number_room)
            ->where('id', '!=', $room->id)
            ->exists();

        if ($isDuplicate) {
            return back()->with('error', 'Nomor kamar sudah digunakan');
        }

        // Update data
        $room->update([
            'number_room' => $request->number_room,
        ]);

        return back()->with('success', 'Kamar berhasil diperbarui');
    }
    public function destroy(string $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return back()->with('error', 'Kamar tidak ditemukan');
        }

        // Cek apakah ada data Resident yang terkait dengan Room ini
        $residents = $room->residents;

        // Jika masih ada penghuni, batalkan penghapusan
        if ($residents->isNotEmpty()) {
            return back()->with('error', 'Maaf, kamar masih ada penghuni yang menempati.');
        }

        // Temukan boarding branch terkait
        $boardingBranch = $room->boardingBranch;

        // Hapus kamar
        $room->delete();

        // Kurangi jumlah kamar di boarding branch
        if ($boardingBranch) {
            $boardingBranch->decrement('room_qty');
        }

        return back()->with('success', 'Kamar berhasil dihapus');
    }
}
