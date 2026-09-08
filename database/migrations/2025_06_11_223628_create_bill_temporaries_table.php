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
        Schema::create('bill_temporaries', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Resident::class, 'resident_id');
            $table->string('invoice');
            $table->integer('amount');
            $table->foreignIdFor(\App\Models\BoardingBranch::class, 'boarding_branch_id');
            $table->date('end_date');
            $table->date('date_invoice')->nullable();
            $table->text('detail_bills')->nullable();
            $table->string('status_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_temporaries');
    }
};
