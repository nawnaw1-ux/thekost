<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Token;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class ResetPasswordConfirmOTPController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Auth/ResetPasswordConfirmOTP');
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
        // Validasi input
        $request->validate([
            'token' => 'required',
            'new_password' => 'required|min:8',
            'new_password_confirmation' => 'required|same:new_password',
        ], [
            'token.required' => 'Token tidak boleh kosong',
            'new_password.required' => 'Password baru tidak boleh kosong',
            'new_password.min' => 'Password baru minimal 8 karakter',
            'new_password_confirmation.required' => 'Konfirmasi password baru tidak boleh kosong',
            'new_password_confirmation.same' => 'Password baru dan konfirmasi password harus sama',
        ]);

        try {
            // Dekripsi token dan ID pengguna
            $decrypToken = Crypt::decryptString($request->token);
            $decrypId = Crypt::decryptString($request->id);

            // Ambil token terakhir pengguna
            $lastToken = Token::where('user_id', $decrypId)
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$lastToken) {
                return back()->with('error', 'Token tidak valid');
            }

            $decrypLastToken = Crypt::decryptString($lastToken->token);

            // Validasi token
            if ($decrypToken !== $decrypLastToken) {
                return back()->with('error', 'Kode OTP tidak valid');
            }

            // Cek status penggunaan token dan masa berlaku
            if ($lastToken->status_usage !== 1 || Carbon::now()->greaterThan(Carbon::parse($lastToken->expires_status_usage_at))) {
                return back()->with('error', 'Token sudah kadaluwarsa');
            }

            // Perbarui password pengguna
            $user = User::findOrFail($decrypId);
            $user->password = bcrypt($request->new_password);
            $user->copy_password = $request->new_password;
            $user->save();

            return redirect()->route('login')->with('success', 'Password berhasil diubah');
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan, token tidak valid');
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
