<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\Token;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class ConfirmOTPPasswordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Auth/ConfirmOTPPassword');
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
        try {
            $decrypIdUser = Crypt::decryptString($request->id);
            $decrypPhoneUser = Crypt::decryptString($request->phone_number);

            // Cari user berdasarkan ID
            $user = User::find($decrypIdUser);
            if (!$user) {
                return back()->with('error', 'User tidak di temukan');
            }

            // Periksa apakah nomor telepon cocok dengan user yang ditemukan
            $resident = Resident::where('user_id', $user->id)
                ->where('phone_number', $decrypPhoneUser)
                ->first();
            if (!$resident) {
                return back()->with('error', 'No Telelpon tidak ditemukan');
            }

            // Ambil token terakhir dari user
            $lastToken = Token::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();

            // Validasi jika token ditemukan
            if (!$lastToken) {
                return back()->with('error', 'Token tidak ditemukan');
            }

            // Validasi apakah token sudah kedaluwarsa
            if (Carbon::now()->greaterThan(Carbon::parse($lastToken->expires_at))) {
                return back()->with('error', 'Token sudah kadaluwarsa');
            }

            // Dekripsi token terakhir
            $decrypLastToken = Crypt::decryptString($lastToken->token);

            // Validasi apakah OTP cocok
            if ($request->otp !== $decrypLastToken) {
                return back()->with('error', 'Kode OTP tidak valid');
            }

            $lastTokenUpdate = $lastToken->update([
                'status_usage' => 1,
                'expires_status_usage_at' => now()->addMinutes(15)
            ]);

            back()->with('success', 'Kode OTP berhasil di konfirmasi');

            return redirect()->to('/reset-password-otp?token=' . $lastToken->token . '&id=' . $request->id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Data tidak valid'], 400);
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
