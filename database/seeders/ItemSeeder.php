<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'id' => 1,
                'name' => 'Kamar Tipe A Sendiri',
                'price' => 1000000,
                'boarding_branch_id' => 1
            ],
            [
                'id' => 2,
                'name' => 'Kamar Tipe A Berdua',
                'price' => 1300000,
                'boarding_branch_id' => 1
            ],
            [
                'id' => 3,
                'name' => 'Kamar Tipe B Sendiri',
                'price' => 500000,
                'boarding_branch_id' => 2
            ]
        ];

        foreach ($items as $key => $value) {
            \App\Models\Item::create($value);
        }
    }
}
