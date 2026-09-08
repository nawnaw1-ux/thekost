<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $promos = [
            [
                'id' => 1,
                'image' => 'promo/promo1.jpg',
            ],
        ];

        foreach ($promos as $key => $value) {
            \App\Models\Promo::create($value);
        }
    }
}
