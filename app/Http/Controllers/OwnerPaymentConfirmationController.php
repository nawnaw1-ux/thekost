<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RecordTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OwnerPaymentConfirmationController extends Controller
{
    private const PAYMENT_NOTE_PREFIX = 'AUTO_PAYMENT:';
    private const PENALTY_NOTE_PREFIX = 'AUTO_PENALTY:';

    public function show(string $token, string $action)
    {
        $payment = $this->getPaymentByToken($token);
        $bill = $this->enrichBill($payment);

        return Inertia::render('PaymentConfirmation/Show', [
            'bill' => $bill,
            'payment' => $payment,
            'action' => $action,
            'actionLabel' => $this->getActionLabel($action),
            'actionDescription' => $this->getActionDescription($action),
            'canConfirm' => $payment->owner_confirmation_status === 'pending',
        ]);
    }

    public function confirm(Request $request, string $token, string $action)
    {
        $payment = $this->getPaymentByToken($token);

        if ($payment->owner_confirmation_status !== 'pending') {
            return redirect()
                ->route('owner.payment-confirmation.show', ['token' => $token, 'action' => $action])
                ->with('success', 'Konfirmasi pembayaran ini sudah diproses sebelumnya.');
        }

        if ($action === 'received') {
            $payment->status = 'lunas';
            $payment->owner_confirmation_status = 'received';

            $bill = $payment->bill;
            $bill->status = 'lunas';
            $bill->date_pay = Carbon::now()->toDateString();
            $bill->save();
            $this->syncIncomeRecords($bill);
            $this->notifyResidentPaymentAccepted($bill);
        } else {
            $payment->status = 'owner_declined';
            $payment->owner_confirmation_status = 'not_received';
        }

        $payment->owner_confirmation_at = Carbon::now();
        $payment->save();

        return redirect()
            ->route('owner.payment-confirmation.show', ['token' => $token, 'action' => $action])
            ->with('success', $action === 'received'
                ? 'Konfirmasi pembayaran diterima berhasil dikirim. Tagihan kini berstatus lunas.'
                : 'Konfirmasi bahwa pembayaran belum diterima berhasil dikirim.');
    }

    private function getPaymentByToken(string $token): Payment
    {
        return Payment::with([
            'bill.detailBills',
            'bill.boardingBranch',
            'bill.resident.user',
        ])->where('owner_confirmation_token', $token)->firstOrFail();
    }

    private function enrichBill(Payment $payment)
    {
        $bill = $payment->bill;
        $bill->ensurePaymentCode();

        if ($bill->end_date) {
            $bill->end_date = Carbon::parse($bill->end_date)->translatedFormat('d F Y');
        }

        if ($bill->date_invoice) {
            $bill->date_invoice = Carbon::parse($bill->date_invoice)->translatedFormat('d F Y');
        }

        if ($bill->date_pay) {
            $bill->date_pay = Carbon::parse($bill->date_pay)->translatedFormat('d F Y');
        }

        return $bill;
    }

    private function getActionLabel(string $action): string
    {
        return $action === 'received'
            ? 'Pembayaran Diterima'
            : 'Pembayaran Belum Diterima';
    }

    private function getActionDescription(string $action): string
    {
        return $action === 'received'
            ? 'Pastikan pembayaran dari penghuni sudah diterima sebelum melakukan konfirmasi ini.'
            : 'Gunakan konfirmasi ini jika pembayaran dari penghuni belum diterima.';
    }

    private function syncIncomeRecords($bill): void
    {
        $residentName = $this->formatResidentName(
            $bill->resident->user->name,
            $bill->resident->user->surname ?? null
        );

        RecordTransaction::updateOrCreate(
            [
                'boarding_branch_id' => $bill->boarding_branch_id,
                'type_record' => 'input',
                'note' => self::PAYMENT_NOTE_PREFIX . $bill->invoice,
            ],
            [
                'amount' => $bill->amount,
                'date' => $bill->date_pay,
                'type' => 'manual',
                'description' => 'Pembayaran ' . $residentName,
            ]
        );

        if ($bill->penalty_day > 0 && $bill->penalty > 0) {
            RecordTransaction::updateOrCreate(
                [
                    'boarding_branch_id' => $bill->boarding_branch_id,
                    'type_record' => 'input-punishment',
                    'note' => self::PENALTY_NOTE_PREFIX . $bill->invoice,
                ],
                [
                    'amount' => $bill->penalty,
                    'date' => $bill->date_pay,
                    'type' => 'manual',
                    'description' => 'Denda ' . $bill->penalty_day . ' Hari - ' . $bill->invoice . ' - ' . $residentName,
                ]
            );
        }
    }

    private function formatResidentName(string $name, ?string $surname = null): string
    {
        $name = trim(preg_replace('/\s+/', ' ', $name) ?? $name);
        $surname = trim(preg_replace('/\s+/', ' ', $surname ?? '') ?? '');

        if ($surname === '') {
            return $name;
        }

        if (Str::lower($name) === Str::lower($surname)) {
            return $name;
        }

        if (Str::endsWith(Str::lower($name), ' ' . Str::lower($surname))) {
            return $name;
        }

        return trim($name . ' ' . $surname);
    }

    private function notifyResidentPaymentAccepted($bill): void
    {
        $residentPhone = $bill->resident?->phone_number;

        if (!$residentPhone) {
            Log::warning('Resident phone number not found for payment accepted notification.', [
                'bill_id' => $bill->id,
                'resident_id' => $bill->resident_id,
            ]);

            return;
        }

        $branchName = $bill->boardingBranch?->name ?? 'kos Anda';
        $message = implode("\n", [
            "Yth. Kakak Penghuni {$branchName},",
            '',
            'Terima kasih telah melakukan pembayaran tagihan kos, pembayaran kakak telah kami terima.',
            '',
            'Untuk melihat riwayat pembayaran atau bukti pembayaran, silakan kunjungi halaman tagihan.',
            '',
            'Tim RoomWise.',
        ]);

        $this->sendWhatsAppMessage(
            $residentPhone,
            $message,
            $bill->id,
            $bill->resident_id,
            'resident-payment-accepted'
        );
    }

    private function sendWhatsAppMessage(
        string $target,
        string $message,
        int $billId,
        int $referenceId,
        string $context
    ): void {
        $fonnteKey = config('app.fonnte_key');

        Log::info('Sending WhatsApp message via owner confirmation flow.', [
            'context' => $context,
            'bill_id' => $billId,
            'reference_id' => $referenceId,
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
                'context' => $context,
                'bill_id' => $billId,
                'reference_id' => $referenceId,
                'target' => $target,
                'message' => $message,
                'error' => curl_error($curl),
            ]);
        } else {
            Log::info('Fonnte response', [
                'context' => $context,
                'bill_id' => $billId,
                'reference_id' => $referenceId,
                'target' => $target,
                'message' => $message,
                'response' => $response,
            ]);
        }

        curl_close($curl);
    }
}
