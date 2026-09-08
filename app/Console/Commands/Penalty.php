<?php

namespace App\Console\Commands;

use App\Models\Resident;
use App\Models\Punishment;
use App\Models\RecordTransaction;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class Penalty extends Command
{
    protected $signature = 'app:penalty';
    protected $description = 'Menghitung dan menerapkan denda keterlambatan pembayaran tagihan';

    public function handle()
    {


        try {
            $fonnte_key = config('app.fonnte_key');
            $today = Carbon::now();
            $residents = Resident::with('bills')->where('status_active', 1)->get();

            foreach ($residents as $resident) {
                $punishment = Punishment::where('boarding_branch_id', $resident->boarding_branch_id)->first();
                $phoneNumbers = $resident->where('id', $resident->id)->pluck('phone_number')->implode(',');

                if (!$punishment) {
                    Log::warning("No punishment rules found for Resident ID {$resident->id}.");
                    continue;
                }

                foreach ($resident->bills as $bill) {
                    if (!$bill->end_date) {
                        Log::warning("Bill ID {$bill->id} for Resident ID {$resident->id} has no end_date.");
                        continue;
                    }

                    $dueDate = Carbon::parse($bill->end_date);

                    if (($dueDate->lessThan($today)  && $bill->status === 'belum lunas') || $bill->status == 'denda') {
                        $daysOverdue = (int) $dueDate->diffInDays($today);

                        if ($dueDate->isSameDay($today)) {
                            Log::info("Bill ID {$bill->id} for Resident ID {$resident->id} is due today, skipping penalty.");
                            continue;
                        }


                        if ($daysOverdue > $punishment->max_day) {
                            Log::info("Bill ID {$bill->id} for Resident ID {$resident->id} has exceeded max penalty days.");
                            continue;
                        }


                        $penaltyDays = min($daysOverdue, $punishment->max_day);
                        $penaltyAmount = $penaltyDays * $punishment->price;


                        if ($penaltyDays == 1) {
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
                                    'target' => $bill->boardingBranch->phone_number,
                                    'message' => "*[Notification]*
                
Tagihan a/n {$resident->user->name} telah melebihi batas waktu jatuh tempo pembayaran.
                
Tim RoomWise.",
                                    'countryCode' => '62',
                                ),
                                CURLOPT_HTTPHEADER => array(
                                    "Authorization: $fonnte_key"
                                ),
                                CURLOPT_SSL_VERIFYPEER => false,
                                CURLOPT_SSL_VERIFYHOST => false,
                            ));
                            $response = curl_exec($curl);
                            if (curl_errno($curl)) {
                                $error_msg = curl_error($curl);
                            }
                            curl_close($curl);

                            if (isset($error_msg)) {
                                Log::info('Error sending SMS : ' . $error_msg);
                            }
                        }

                        if ($penaltyDays == $punishment->max_day) {
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
                                    'target' => $bill->boardingBranch->phone_number,
                                    'message' => "*[Notification]*
                
Tagihan a/n {$resident->user->name} telah mencapai batas maksimal denda keterlambatan.
                
Tim RoomWise.",
                                    'countryCode' => '62',
                                ),
                                CURLOPT_HTTPHEADER => array(
                                    "Authorization: $fonnte_key"
                                ),
                                CURLOPT_SSL_VERIFYPEER => false,
                                CURLOPT_SSL_VERIFYHOST => false,
                            ));
                            $response = curl_exec($curl);
                            if (curl_errno($curl)) {
                                $error_msg = curl_error($curl);
                            }
                            curl_close($curl);

                            if (isset($error_msg)) {
                                Log::info('Error sending SMS : ' . $error_msg);
                            }
                        }


                        $message = "Yth Kakak penghuni {$resident->boardingBranch->name}\n\n" .
                            "Tagihan anda dikenakan DENDA. Segera lakukan pembayaran.\n\n" .
                            "Keterlambatan : {$penaltyDays} hari\n" .
                            "Denda : Rp" . number_format($penaltyAmount, 0, ',', '.') . "\n" .
                            "Maksimal denda : {$punishment->max_day} hari\n\n" .
                            "Informasi mengenai jumlah tagihan & pengunduhan invoice dapat dilakukan dihalaman tagihan\n\n" .
                            "Terima kasih dan abaikan pemberitahuan ini apabila Sudah melakukan pembayaran.\n\n" .
                            "Tim RoomWise.";
                        $bill->update([
                            'status' => 'denda',
                            'penalty_day' => $penaltyDays,
                            'penalty' => $penaltyAmount,
                        ]);

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
                                'target' => $phoneNumbers,
                                'message' => $message,
                                'countryCode' => '62',
                            ),
                            CURLOPT_HTTPHEADER => array(
                                "Authorization: $fonnte_key"
                            ),
                            CURLOPT_SSL_VERIFYPEER => false,
                            CURLOPT_SSL_VERIFYHOST => false,
                        ));
                        $response = curl_exec($curl);
                        if (curl_errno($curl)) {
                            $error_msg = curl_error($curl);
                        }
                        curl_close($curl);

                        if (isset($error_msg)) {
                            Log::info('Error sending SMS : ' . $error_msg);
                        }

                        Log::info("Applying penalty to bill ID {$bill->id} for Resident ID {$resident->id}: Rp{$penaltyAmount} ({$penaltyDays} days late)");
                    }
                }
            }

            $this->info("Penalty calculation completed successfully.");
        } catch (\Exception $e) {
            Log::error("Error in Penalty command: " . $e->getMessage());
            $this->error("An error occurred. Check logs for details.");
        }
    }
}
