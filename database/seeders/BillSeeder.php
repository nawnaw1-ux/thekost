<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bills = [
            [
                'invoice' => 'INV/USER/JAN/2024',
                'resident_id' => 1,
                'amount' => 1000000,
                'status' => 'lunas',
                'date_pay' => '2024-01-29',
                'end_date' => '2024-01-31',
                'date_invoice' => '2024-01-28',
            ],
            //  [
            //     'invoice' => 'INV/USER/FEB/2024',
            //     'resident_id' => 1,
            //     'amount' => 1000000,
            //     'status' => 'lunas',
            //     'date_pay' => '2024-03-02',
            //     'end_date' => '2024-03-02',
            //     'date_invoice' => '2024-02-28',
            // ], [
            //     'invoice' => 'INV/USER/MAR/2024',
            //     'resident_id' => 1,
            //     'amount' => 1000000,
            //     'status' => 'belum lunas',
            //     'date_pay' => '2024-04-02',
            //     'end_date' => '2024-04-02',
            //     'date_invoice' => '2024-03-29',
            // ],
            // [
            //     'invoice' => 'INV/USER/APR/2024',
            //     'resident_id' => 1,
            //     'amount' => 1000000,
            //     'status' => 'denda',
            //     'date_pay' => '2024-05-02',
            //     'end_date' => '2024-05-02',
            //     'date_invoice' => '2024-04-29',
            // ],
        ];

        foreach ($bills as $bill) {
            \App\Models\Bill::create($bill);
        }
    }
}
