<?php

namespace App\Console\Commands;

use App\Models\Bill;
use App\Models\Resident;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GenerateBills extends Command
{
    protected $signature = 'app:generate-bills';
    protected $description = 'Generate bills for residents setiap tanggal 1';

    public function handle()
    {
        // Jalankan hanya di tanggal 1 setiap bulan
        $today = Carbon::today();
        if ($today->day !== 1) {
            $this->info("GenerateBills hanya dijalankan di tanggal 1 setiap bulan.");
            return;
        }

        $residents = Resident::with(['bills', 'needs.item', 'boardingBranch', 'user'])
            ->where('status_active', 1)
            ->get();

        foreach ($residents as $resident) {
            $latestBill = $resident->bills->last();
            if (!$latestBill) continue;

            $lastEndDate = Carbon::parse($latestBill->end_date);
            $lastInvoiceDate = Carbon::parse($latestBill->date_invoice);

            // Validasi: hanya lanjut jika end_date bulan lalu
            if ($lastEndDate->lt($today->copy()->startOfMonth())) {

                $newEndDate = $lastEndDate->copy()->addMonthNoOverflow();
                $newInvoiceDate = $lastInvoiceDate->copy()->addMonthNoOverflow();
                $needs = $resident->needs;
                $amount = $needs->sum(fn($need) => $need->item->price);

                $branchName = Str::upper($resident->boardingBranch->name);
                $invoice = 'INV/' . $branchName . '/' . Str::upper($resident->user->surname) . '/' . $newInvoiceDate->translatedFormat('m/Y');

                $bill = Bill::create([
                    'resident_id' => $resident->id,
                    'end_date' => $newEndDate->toDateString(),
                    'date_invoice' => $newInvoiceDate->toDateString(),
                    'amount' => $amount,
                    'invoice' => $invoice,
                    'boarding_branch_id' => $resident->boarding_branch_id,
                ]);

                foreach ($needs as $need) {
                    $bill->detailBills()->create([
                        'bill_id' => $bill->id,
                        'name' => $need->item->name,
                        'price' => $need->item->price,
                    ]);
                }

                Log::info("Generated bill for {$resident->phone_number} | Invoice: {$invoice} | End Date: {$newEndDate} | Invoice Date: {$newInvoiceDate} | Amount: {$amount}");
            }
        }

        $this->info("GenerateBills dijalankan untuk tanggal 1: " . $today->toDateString());
    }
}
