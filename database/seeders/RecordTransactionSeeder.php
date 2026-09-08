<?php

namespace Database\Seeders;

use App\Models\RecordTransaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecordTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $recordTransactions = [
            [
                'id' => 1,
                'amount' => 50000,
                'boarding_branch_id' => 1,
                'date' => now(),
                'type' => 'auto',
                'type_record' => 'input',

            ],
            [
                'id' => 2,
                'amount' => 50000,
                'boarding_branch_id' => 2,
                'date' => now(),
                'type' => 'manual',
                'type_record' => 'input',
            ],
            [
                'id' => 3,
                'amount' => 50000,
                'boarding_branch_id' => 3,
                'date' => now(),
                'type' => null, // Tambahkan null
                'type_record' => 'output',
            ],
            [
                'id' => 4,
                'amount' => 50000,
                'boarding_branch_id' => 4,
                'date' => now(),
                'type' => null, // Tambahkan null
                'type_record' => 'output',
            ]
        ];

        RecordTransaction::insert($recordTransactions);
    }
}
