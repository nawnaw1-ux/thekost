<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Bill;
use App\Models\BillTemporary;
use App\Models\BoardingBranch;
use App\Models\ResidentNeed;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ResidentController extends Controller
{

    public function index()
    {
        $bills = Bill::with(['resident.user' => function ($query) {}, 'detailBills', 'payment', 'boardingBranch'])
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })->where('status_active', 1)
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
                $bill->subtotal = $bill->amount + $bill->penalty;
                return $bill;
            });


        $filteredBills = Bill::with(['resident.user' => function ($query) {}, 'detailBills', 'payment', 'boardingBranch'])
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })->where('status_active', 1)
            ->get()
            ->filter(function ($bill) {
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
            ->values();


        $filteredBills2 = Bill::with(['resident.user' => function ($query) {}, 'detailBills',  'payment', 'boardingBranch'])
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })->where('status_active', 1)
            ->get()
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
            ->values();


        $filteredBills3 = Bill::with(['resident.user' => function ($query) {}, 'detailBills',  'payment', 'boardingBranch'])
            ->whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })->where('status_active', 1)
            ->get()
            ->filter(function ($bill) {
                // Compare the raw end_date month with the previous month
                if ($bill->end_date) {
                    return Carbon::parse($bill->end_date)->format('F') === Carbon::now()->subMonth()->format('F');
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

        $boardingBranch = BoardingBranch::with([
            'residents' => function ($query) {
                $query->where('status_active', 1)
                    ->whereHas('user', function ($q) {
                        $q->where('status_active', 1);
                    });
            },
            'residents.user',
            'residents.needs.item',
            'residents.room',
            'residents.bills' => function ($query) {
                $query->orderByDesc('end_date')->limit(1);
            }
        ])->where('is_activated', 1)->first();

        $residents = $boardingBranch ? $boardingBranch->residents->map(function ($resident) {
            // Ambil 1 tagihan terbaru dan ubah ke format object (bukan array)
            $resident->bills = $resident->bills->first() ?? (object) [];
            return $resident;
        }) : [];


        return inertia('Admin/Resident/Index', [
            'residents' => $residents,
            'bills' => $bills,
            'thisMonth' => $thisMonth,
            'filteredBills' => $filteredBills,
            'nextMonth' => $nextMonth,
            'filteredBills2' => $filteredBills2,
            'beforeMonth' => $beforeMonth,
            'filteredBills3' => $filteredBills3
        ]);
    }

    public function create()
    {
        $roomEmpty = BoardingBranch::with(['rooms' => function ($query) {
            $query->whereDoesntHave('residents')
                ->orWhereHas('residents', function ($subQuery) {
                    $subQuery->havingRaw('COUNT(*) < 2');
                }, '=', 1);
        }])
            ->where('is_activated', 1)
            ->get()
            ->pluck('rooms')
            ->flatten();
        return inertia(
            'Admin/Resident/Resident/Create',
            [
                'roomEmpty' => $roomEmpty
            ]
        );
    }
  public function storeResident(Request $request)
{
    $validated = $request->validate([
        'name' => 'required',
        'surname' => 'required',
        'email' => [
            'required',
            'email',
            Rule::unique('users')->where(fn($query) => $query->where('status_active', 1)),
        ],
        'password' => 'required',
        'phone_number' => [
            'required',
            Rule::unique('residents')->where(fn($query) => $query->where('status_active', 1)),
        ],
        'boarding_branch_id' => 'required',
        'gender' => 'required',
        'room_id' => 'required',
        'number_plat' => 'nullable',
        'plat_number' => 'nullable',
        'end_date' => 'required|date',
        'needs' => 'required|array|min:1',
    ], [
        'name.required' => 'nama wajib diisi',
        'surname.required' => 'surname wajib diisi',
        'boarding_branch_id.required' => 'cabang kos wajib diisi',
        'email.required' => 'email wajib diisi',
        'email.email' => 'email harus berupa email',
        'email.unique' => 'email sudah terdaftar dan masih aktif',
        'password.required' => 'password wajib diisi',
        'phone_number.required' => 'nomor telepon wajib diisi',
        'phone_number.unique' => 'nomor telepon sudah terdaftar dan masih aktif',
        'gender.required' => 'gender wajib diisi',
        'needs.required' => 'kebutuhan wajib diisi',
        'end_date.required' => 'Tanggal Tagihan wajib diisi',
        'room_id.required' => 'Kamar wajib diisi',
    ]);

    try {
        $user = User::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'copy_password' => $validated['password'],
            'role' => 'resident',
            'status_active' => 1,
        ]);

        $resident = Resident::create([
            'user_id' => $user->id,
            'gender' => $validated['gender'],
            'phone_number' => $validated['phone_number'],
            'boarding_branch_id' => $validated['boarding_branch_id'],
            'room_id' => $validated['room_id'],
            'number_plat' => $validated['number_plat'] ?? null,
            'status_active' => 1,
            'tanggal_masuk' => Carbon::now(),
        ]);

        foreach ($validated['needs'] as $need) {
            ResidentNeed::create([
                'resident_id' => $resident->id,
                'item_id' => $need['id'],
            ]);
        }

        // ================================
        // Generate Invoice & Bills
        // ================================
        $needs = $resident->needs()->with('item')->get();
        $amount = $needs->sum(fn($n) => $n->item->price);
        $branchName = Str::upper($resident->boardingBranch->name);

        // ambil bulan & tahun dari end_date, bukan dari now()
        $endDate = Carbon::parse($validated['end_date']);
        $invoice = 'INV/' . $branchName . '/' . Str::upper($user->surname) . '/' . $endDate->translatedFormat('m/Y');
        $tanggal_h_min_3 = $endDate->copy()->subDays(3);

        $detailBillsArray = [];
        foreach ($needs as $need) {
            $detailBillsArray[] = [
                'name' => $need->item->name,
                'price' => $need->item->price,
            ];
        }

        BillTemporary::create([
            'boarding_branch_id' => $resident->boardingBranch->id,
            'invoice' => $invoice,
            'resident_id' => $resident->id,
            'end_date' => $endDate,
            'date_invoice' => $tanggal_h_min_3,
            'amount' => $amount,
            'detail_bills' => $detailBillsArray,
        ]);

        $bill = Bill::create([
            'boarding_branch_id' => $resident->boardingBranch->id,
            'invoice' => $invoice,
            'resident_id' => $resident->id,
            'end_date' => $endDate,
            'date_invoice' => $tanggal_h_min_3,
            'amount' => $amount,
        ]);

        foreach ($needs as $need) {
            $bill->detailBills()->create([
                'bill_id' => $bill->id,
                'name' => $need->item->name,
                'price' => $need->item->price
            ]);
        }

        // ================================
        // Kirim WhatsApp ke penghuni baru
        // ================================
        $kos = $resident->boardingBranch;
        $fonnte_key = config('app.fonnte_key');
        $myapp = config('app.url');

        try {
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://api.fonnte.com/send',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => [
                    'target' => $resident->phone_number,
                    'message' => "Halo, {$request->name}\n" .
                        "Selamat, akun RoomWise anda berhasil dibuat.\n\n" .
                        "Nama Kos : {$kos->name}\n" .
                        "Email: {$request->email}\n" .
                        "Password: {$request->password}\n" .
                        "Akses login : {$myapp}\n\n" .
                        "Tim RoomWise.",
                    'delay' => '2',
                    'countryCode' => '62',
                ],
                CURLOPT_HTTPHEADER => [
                    "Authorization: $fonnte_key"
                ],
            ]);
            curl_exec($curl);
            curl_close($curl);

            return back()->with('success', 'Data user dan resident berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error('WA failed: ' . $e->getMessage());
            return back()->with('warning', 'Data berhasil ditambahkan, namun gagal mengirim WA.');
        }
    } catch (\Exception $e) {
        Log::error('Store Resident failed: ' . $e->getMessage());
        return back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    }
}


    public function storeExcel(Request $request)
    {

        $dataExcel = $request->dataExcel;
        $insertedCount = 0;
        $duplicates = [];

        foreach ($dataExcel as $data) {
            $existingAudience = User::where('email', $data['email'])
                ->first();
            $randomString = Str::random(10);
            if ($existingAudience) {
                $duplicates[] = [
                    'name' => $data['name'],
                    'email' => $data['email'],

                    'password' => Hash::make($randomString),
                    'copy_password' => $randomString,
                    'role' => 'resident',
                    'phone_number' => $data['phone_number'],
                    'gender' => $data['gender'],
                    'number_plat' => $data['number_plat'],
                    'message' => 'Data sudah ada, tidak dimasukkan.'
                ];
                continue;
            }

            $validator = FacadesValidator::make($data, [
                'name' => 'required',
                'email' => 'required|email|unique:users,email',
                'phone_number' => 'required|unique:residents,phone_number',

                'gender' => 'required',
            ], [
                'name.required' => 'Nama harus diisi',
                'email.required' => 'Email harus diisi',
                'phone_number.required' => 'Nomor telepon harus diisi',

                'gender.required' => 'Gender harus diisi',
                'email.unique' => 'Email sudah ada',
                'phone_number.unique' => 'Nomor telepon sudah ada',
            ]);

            if ($validator->fails()) {
                $duplicates[] = [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($randomString),
                    'copy_password' => $randomString,
                    'role' => 'resident',
                    'phone_number' => $data['phone_number'],
                    'gender' => $data['gender'],
                    'number_plat' => $data['number_plat'],
                    'message' => 'Data sudah ada, tidak dimasukkan.'
                ];
                continue;
            }

            $surname = explode(' ', $data['name'])[0]; // Mengambil elemen pertama dari array
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($randomString),
                'role' => 'resident',
                'copy_password' => $randomString,
                'surname' => $surname,
            ]);
            Resident::create([
                'user_id' => $user->id,
                'gender' => $data['gender'],
                'phone_number' => $data['phone_number'],
                'number_plat' => $data['number_plat'],
                'boarding_branch_id' => $data['boarding_branch_id'],

            ]);
            $insertedCount++;
        }

        return Inertia::render('Admin/Resident/Index', [
            'residents' => Resident::whereHas('boardingBranch', function ($query) {
                $query->where('is_activated', 1);
            })->with(['user', 'boardingBranch'])->get(),
            'message' => $insertedCount . ' data berhasil dimasukkan',
            'duplicates' => $duplicates,
            'total' => count($dataExcel) - $insertedCount . ' data tidak dimasukkan'
        ]);
    }
    public function updateResident(Request $request)
    {
        $resident = Resident::find($request->id);

        if (!$resident) {
            return back()->with('error', 'Data user dan data resident gagal diupdate');
        }

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $resident->user_id,
            'password' => 'required',
            'phone_number' => 'required|numeric|unique:residents,phone_number,' . $resident->id,
            'gender' => 'required',
            'surname' => 'required',
        ], [
            'name.required' => 'nama wajib diisi',
            'surname.required' => 'nama belakang wajib diisi',
            'email.required' => 'email wajib diisi',
            'email.email' => 'email harus berupa email',
            'email.unique' => 'email sudah terdaftar',
            'password.required' => 'password wajib diisi',
            'phone_number.required' => 'nomor telepon wajib diisi',
            'phone_number.unique' => 'nomor telepon sudah terdaftar',
            'phone_number.numeric' => 'nomor telepon harus berupa angka',
            'gender.required' => 'gender wajib diisi',
        ]);

        $user = User::find($resident->user_id);

        if (!$user) {
            return back()->with('error', 'User tidak ditemukan');
        }

        // Simpan data lama sebelum update
        $oldEmail = $user->email;
        $oldPassword = $user->copy_password;

        // Update user data
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'copy_password' => $request->password,
            'surname' => $request->surname,
            'number_plat' => $request->number_plat,
            'role' => 'resident',
        ]);

        // Update resident data
        $resident->update([
            'number_room' => $request->number_room,
            'gender' => $request->gender,
            'phone_number' => $request->phone_number,
            'number_plat' => $request->number_plat
        ]);

        // Hanya kirim WhatsApp jika email atau password berubah
        if ($oldEmail !== $request->email || $oldPassword !== $request->password) {
            try {
                $curl = curl_init();

                curl_setopt_array($curl, array(
                    CURLOPT_URL => 'https://api.fonnte.com/send',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 0,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'POST',
                    CURLOPT_POSTFIELDS => array(
                        'target' => $request->phone_number,
                        'message' => "Halo, {$request->name}, akun Anda di RoomWise telah diperbarui. Berikut informasi terbaru:\n\n" .
                            "Email: {$request->email}\n" .
                            "Password: {$request->password}\n\n" .
                            "Terima kasih telah menggunakan RoomWise.\n\nSalam,\nTim RoomWise",
                        'delay' => '2',
                        'countryCode' => '62',
                    ),
                    CURLOPT_HTTPHEADER => array(
                        'Authorization: p8mBzc2v!cV!nDCDKxXR'
                    ),
                ));

                $response = curl_exec($curl);
                curl_close($curl);
            } catch (\Exception $e) {
                Log::error('Gagal mengirim WhatsApp: ' . $e->getMessage());
                return back()->with('warning', 'Data berhasil diperbarui, namun gagal mengirim WhatsApp.');
            }
        }

        return back()->with('success', 'Data user dan resident berhasil diperbarui');
    }


    public function destroy(string $id)
    {
        $resident = Resident::find($id);

        if ($resident) {
            $user = User::find($resident->user_id);

            if ($user) {
                // Nonaktifkan resident dan user
                $resident->status_active = 0;
                $resident->tanggal_keluar = Carbon::now();
                $resident->room_id = null;
                $resident->save();

                $user->status_active = 0;
                $user->save();

                // Nonaktifkan semua tagihan permanen
                Bill::where('resident_id', $resident->id)->update([
                    'status_active' => 0
                ]);

                if ($resident->temporaryBills()->exists()) {
                    BillTemporary::where('resident_id', $resident->id)->update([
                        'status_active' => 0
                    ]);
                }
            }

            return back()->with('success', 'Data user, resident, dan tagihan berhasil di-nonaktifkan');
        } else {
            return back()->with('error', 'Data resident tidak ditemukan');
        }
    }
}
