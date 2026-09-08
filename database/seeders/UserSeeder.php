<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = [
            [
                'name' => 'Admin',
                'email' => 'id.thekost@gmail.com',
                'role' => 'admin',
                'password' => Hash::make('thekost098'),
            ],

        ];

        foreach ($user as $key => $value) {
            \App\Models\User::create($value);
        }
    }
}
