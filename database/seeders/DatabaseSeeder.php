<?php

namespace Database\Seeders;


// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\RecordTransaction;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            // ResidentSeeder::class,
            // ResidentNeedSeeder::class,
            // ItemSeeder::class,
            // PromoSeeder::class,
            // BillSeeder::class,
            // DetailBillSeeder::class,
            // PunishmentSeeder::class,
            // BoardingBranchSeeder::class,
            BoardingServiceSeeder::class,
            // RoomSeeder::class,
            // RecordTransactionSeeder::class
        ]);
    }
}
