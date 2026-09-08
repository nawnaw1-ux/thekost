<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\Token;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Crypt;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate(
            [
                'phone_number' => 'required|exists:residents,phone_number',
            ],
            [
                'phone_number.required' => 'Nomor telepon wajib diisi.',
                'phone_number.exists' => 'Nomor telepon tidak ditemukan.'
            ]
        );
        $fonnte_key = config('app.fonnte_key');
        $otp = rand(100000, 999999);

        $findResiddenByPhoneNumber = Resident::where('phone_number', $request->phone_number)->first();
        $idUser = $findResiddenByPhoneNumber->user_id;
        $phoneResident = $findResiddenByPhoneNumber->phone_number;

        $encryptedUserId = Crypt::encryptString($idUser);
        $encryptedPhoneNumber = Crypt::encryptString($phoneResident);
        // Encrypt OTP using Laravel Crypt facade
        $encryptedOtp = Crypt::encryptString($otp);

        $token = Token::create([
            'token' => $encryptedOtp,
            'user_id' => $findResiddenByPhoneNumber->user_id,
            'expires_at' => now()->addMinutes(15)
        ]);

        $user = User::find($findResiddenByPhoneNumber->user_id);
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
                'target' => $request->phone_number . '|' . $otp . '|' . $user->name,
                'message' => "Halo, {var1}.\n\nKode OTP Anda adalah: *{$otp}*.\nGunakan kode ini untuk mengatur ulang kata sandi Anda.\n\nKode berlaku selama 15 menit.",

                'delay' => '2',
                'countryCode' => '62', //optional
            ),
            CURLOPT_HTTPHEADER => array(
                "Authorization: $fonnte_key" //change TOKEN to your actual token
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        return redirect()->to('/input-otp?id=' . $encryptedUserId . '&&pn=' . $encryptedPhoneNumber);
    }
}
