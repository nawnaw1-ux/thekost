<?php

namespace Database\Seeders;

use App\Models\Punishment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PunishmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Punishment::create([
            'price' => 30000,
            'boarding_branch_id' => 1,
            'max_day' => 7
        ]);
        Punishment::create([
            'price' => 30000,
            'boarding_branch_id' => 2,
            'max_day' => 7
        ]);
    }
}
