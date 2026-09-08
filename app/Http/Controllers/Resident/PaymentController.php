<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function payment(Request $request)
    {
        $request->validate([
            'bill_id' => ['required', 'integer'],
        ]);

        $user = Auth::user();
        $bill = Bill::with(['resident.user', 'boardingBranch'])
            ->where('id', $request->bill_id)
            ->whereHas('resident', fn($query) => $query->where('user_id', $user->id))
            ->first();

        if (!$bill) {
            return back()->with('error', 'Tagihan tidak ditemukan.');
        }

        if ($bill->status === 'lunas') {
            return back()->with('error', 'Tagihan ini sudah dinyatakan lunas.');
        }

        $payment = Payment::firstOrNew(['bill_id' => $bill->id]);
        $payment->status = 'pending_owner_confirmation';
        $payment->owner_confirmation_status = 'pending';
        $payment->owner_confirmation_token = (string) Str::uuid();
        $payment->owner_confirmation_requested_at = Carbon::now();
        $payment->owner_confirmation_at = null;
        $payment->save();

        $ownerReceivedLink = route('owner.payment-confirmation.show', [
            'token' => $payment->owner_confirmation_token,
            'action' => 'received',
        ]);
        $ownerNotReceivedLink = route('owner.payment-confirmation.show', [
            'token' => $payment->owner_confirmation_token,
            'action' => 'not-received',
        ]);

        $ownerPhone = $bill->boardingBranch?->phone_number;

        if (!$ownerPhone) {
            Log::warning('Owner phone number not found for bill payment confirmation.', [
                'bill_id' => $bill->id,
                'boarding_branch_id' => $bill->boarding_branch_id,
            ]);

            return redirect()
                ->route('resident.bill.index')
                ->with('success', 'Konfirmasi pembayaran berhasil. Menunggu konfirmasi pemilik kos.');
        }

        $residentName = $this->formatResidentFullName(
            $bill->resident->user->name,
            $bill->resident->user->surname ?? null
        );

        $message = implode("\n", [
            '*[Notification]*',
            '',
            "Penghuni a/n {$residentName} telah melakukan pembayaran, harap periksa rekening anda dan konfirmasi dengan klik link berikut apabila dana telah diterima.",
            '',
            'Pembayaran diterima :',
            $ownerReceivedLink,
            '',
            'Pembayaran belum diterima :',
            $ownerNotReceivedLink,
            '',
            'Tim RoomWise.',
        ]);

        $this->sendWhatsAppMessage($ownerPhone, $message, $bill->id, $payment->id);

        return redirect()
            ->route('resident.bill.index')
            ->with('success', 'Konfirmasi pembayaran berhasil. Menunggu konfirmasi pemilik kos.');
    }

    private function formatResidentFullName(string $name, ?string $surname = null): string
    {
        $fullName = trim($name . ' ' . ($surname ?? ''));

        return preg_replace('/\s+/', ' ', $fullName) ?: $name;
    }

    private function sendWhatsAppMessage(string $target, string $message, int $billId, int $paymentId): void
    {
        $fonnteKey = config('app.fonnte_key');

        Log::info('Sending WhatsApp payment confirmation to owner.', [
            'bill_id' => $billId,
            'payment_id' => $paymentId,
            'target' => $target,
            'message' => $message,
        ]);

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62',
            ],
            CURLOPT_HTTPHEADER => [
                "Authorization: {$fonnteKey}",
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ]);

        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            Log::error('Failed to send WhatsApp message via Fonnte.', [
                'bill_id' => $billId,
                'payment_id' => $paymentId,
                'target' => $target,
                'message' => $message,
                'error' => curl_error($curl),
            ]);
        } else {
            Log::info('Fonnte response', [
                'bill_id' => $billId,
                'payment_id' => $paymentId,
                'target' => $target,
                'message' => $message,
                'response' => $response,
            ]);
        }

        curl_close($curl);
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
