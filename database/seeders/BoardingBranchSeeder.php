<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BoardingBranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boardingBranches = [
            [
                'name' => 'Pusat',
                'address' => 'Jl. Pusat',
                'phone_number' => '08123456789',
                'room_qty' => 15,
                'is_activated' => true,

            ],
            [
                'name' => 'Bandung',
                'address' => 'Jl. Bandung',
                'phone_number' => '08123456789',
                'room_qty' => 10,
            ]
        ];

        foreach ($boardingBranches as $boardingBranch) {
            \App\Models\BoardingBranch::create($boardingBranch);
        }
    }
}
