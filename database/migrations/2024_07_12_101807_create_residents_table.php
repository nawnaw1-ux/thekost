<?php

use App\Models\User;
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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->string('phone_number');
            $table->string('gender');
            $table->date('tanggal_masuk')->nullable();
            $table->date('tanggal_keluar')->nullable();
            $table->string('number_plat')->nullable();
            $table->foreignIdFor(\App\Models\Room::class, ('room_id'))->nullable();
            $table->foreignIdFor(\App\Models\BoardingBranch::class, 'boarding_branch_id');
            $table->string('status_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
