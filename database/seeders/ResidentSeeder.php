<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $residents = [
            [
                'id' => 1,
                'user_id' => 2,
                'room_id' => 1,
                'gender' => 'Laki-laki',
                'phone_number' => '085158994494',
                'boarding_branch_id' => 1,
                'number_plat' => 'B 1234',
            ],
        ];

        foreach ($residents as $key => $value) {
            \App\Models\Resident::create($value);
        }
    }
}
