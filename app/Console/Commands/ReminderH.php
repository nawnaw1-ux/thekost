<?php

namespace App\Console\Commands;

use App\Models\Resident;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ReminderH extends Command
{
    protected $signature = 'app:reminder-h';
    protected $description = 'Send payment reminders to residents for due bills';

    public function handle()
    {
        $residents = Resident::with('bills', 'boardingBranch', 'user')
            ->where('status_active', 1)
            ->get();

        $currentDate = Carbon::now(config('app.timezone'));
        $fonnte_key = config('app.fonnte_key');

        foreach ($residents as $resident) {
            $phoneNumbers = $resident->phone_number;

            foreach ($resident->bills as $bill) {
                // Skip jika sudah lunas
                if ($bill->status === 'lunas') {
                    Log::info("Skipping reminder for {$phoneNumbers} because bill {$bill->invoice} is already paid.");
                    continue;
                }

                $billEndDate = Carbon::parse($bill->end_date);
                $billInvoiceDate = Carbon::parse($bill->date_invoice);
                $formatIndo = $billEndDate->translatedFormat('d F Y');

                // Tentukan apakah perlu kirim pesan
                $kirimPesan = false;
                if ($billEndDate->isSameDay($currentDate)) {
                    $kirimPesan = true;
                } elseif ($billInvoiceDate->isSameDay($currentDate)) {
                    $kirimPesan = true;
                }

                if ($kirimPesan) {
                    $branchName = optional($resident->boardingBranch)->name ?? 'TheKost';
                    $message = "Yth Kakak penghuni {$branchName},\n\n" .
                        "Tagihan dengan nomor invoice {$bill->invoice} akan jatuh tempo pada {$formatIndo}. " .
                        "Segera lakukan pembayaran untuk menghindari denda keterlambatan, dengan cara:\n\n" .
                        "1. Login ke website pembayaran kos " . config('app.url') . "\n" .
                        "2. Masuk ke halaman tagihan\n" .
                        "3. Bayar menggunakan metode pembayaran yang telah disediakan\n\n" .
                        "Informasi mengenai jumlah tagihan & pengunduhan invoice dapat dilakukan di halaman tagihan.\n\n" .
                        "Terima kasih dan abaikan pemberitahuan ini apabila sudah melakukan pembayaran.";

                    $this->sendFonnteMessage($phoneNumbers, $message, $fonnte_key);

                    Log::info("Reminder sent to {$phoneNumbers} for bill {$bill->invoice} due on {$formatIndo}.");
                } else {
                    Log::info("Skipping reminder for {$phoneNumbers} - no due bill today.");
                }
            }
        }
    }

    /**
     * Kirim pesan melalui Fonnte API
     */
    private function sendFonnteMessage($target, $message, $apiKey)
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62',
            ],
            CURLOPT_HTTPHEADER => [
                "Authorization: $apiKey"
            ],
        ]);
        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            Log::error('Error sending SMS to ' . $target . ': ' . curl_error($curl));
        } else {
            Log::info("Fonnte API response for {$target}: " . $response);
        }
        curl_close($curl);
    }
}
