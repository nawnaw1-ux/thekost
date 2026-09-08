<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResidentNeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $residentNeeds = [
            [
                'id' => 1,
                'item_id' => 1,
                'resident_id' => 1
            ],
            [
                'id' => 2,
                'item_id' => 2,
                'resident_id' => 1
            ]
        ];

        foreach ($residentNeeds as $key => $value) {
            \App\Models\ResidentNeed::create($value);
        }
    }
}
