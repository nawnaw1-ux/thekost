<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DetailBillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $detailBills = [
            [
                'bill_id' => 1,
                'name' => 'Kamar Tipe A Sendiri',
                'price' => 100000
            ],
            //  [
            //     'bill_id' => 2,
            //     'name' => 'Kamar Tipe A Sendiri',
            //     'price' => 100000
            // ], [
            //     'bill_id' => 3,
            //     'name' => 'Kamar Tipe A Sendiri',
            //     'price' => 100000
            // ],
        ];

        foreach ($detailBills as $detailBill) {
            \App\Models\DetailBill::create($detailBill);
        }
    }
}
