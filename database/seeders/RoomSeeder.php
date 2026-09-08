<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 15; $i++) {
            \App\Models\Room::create([
                'number_room' => $i,
                'boarding_branch_id' => 1,

            ]);
        }
        for ($i = 1; $i <= 15; $i++) {
            \App\Models\Room::create([
                'number_room' => $i,
                'boarding_branch_id' => 2
            ]);
        }
    }
}
