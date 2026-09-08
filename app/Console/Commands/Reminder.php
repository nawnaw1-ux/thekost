<?php

namespace App\Console\Commands;

use App\Models\Bill;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class Reminder extends Command
{
    protected $signature = 'app:reminder';

    protected $description = 'Kirim pengingat untuk tagihan berdasarkan date_invoice';

    public function handle()
    {
        $today = Carbon::today(config('app.timezone'))->toDateString();
        $fonnte_key = config('app.fonnte_key');

        $bills = Bill::where(function ($query) use ($today) {
            $query->whereDate('date_invoice', $today)
                ->orWhereDate('end_date', $today);
        })
            ->where('status', '!=', 'lunas')
            ->whereHas('resident', function ($query) {
                $query->where('status_active', 1);
            })
            ->with(['resident', 'boardingBranch'])
            ->get();


        if ($bills->isEmpty()) {
            $this->info("Tidak ada tagihan aktif untuk reminder hari ini.");
            return;
        }

        foreach ($bills as $bill) {
            $resident = $bill->resident;

            $phoneNumbers = $resident->phone_number;
            $invoice = $bill->invoice;
            $nowDate = Carbon::parse($bill->end_date)->locale('id');
            $branchName = optional($bill->boardingBranch)->name ?? 'TheKost';
            $message = "Reminder: Tagihan untuk Resident ID {$resident->id} ({$invoice}) diproses hari ini.";
            Log::info($message);

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
                    'target' => $phoneNumbers . '|' . $invoice . '|' . $nowDate->translatedFormat('d F Y') . '|' . config('app.url'),
                    'message' => "Yth Kakak penghuni {$branchName},

Tagihan dengan nomor invoice {name} akan jatuh tempo pada
{var1}. Segera lakukan pembayaran untuk 
menghindari denda keterlambatan, dengan cara :

1. Login ke website pembayaran kos {var2}
2. Masuk ke halaman tagihan
3. Bayar menggunakan metode pembayaran yang telah disediakan

Informasi mengenai jumlah tagihan & pengunduhan invoice dapat dilakukan di halaman tagihan

Terima kasih dan abaikan pemberitahuan ini apabila sudah melakukan pembayaran",
                    'countryCode' => '62',
                ),
                CURLOPT_HTTPHEADER => array(
                    "Authorization: $fonnte_key"
                ),
            ));

            $response = curl_exec($curl);
            curl_close($curl);

            $this->info($message);
        }
    }
}
