<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('boarding_branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address');

            $table->string('phone_number');
            $table->integer('room_qty');
            $table->boolean('is_activated')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boarding_branches');
    }
};
