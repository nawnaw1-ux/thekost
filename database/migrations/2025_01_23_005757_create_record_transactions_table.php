<?php

use App\Models\BoardingBranch;
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
        Schema::create('record_transactions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('amount');
            $table->text('description');
            $table->text('note')->nullable();
            $table->foreignIdFor(BoardingBranch::class, 'boarding_branch_id');
            $table->date('date');
            $table->string('type')->nullable(); //auto, manual
            $table->string('type_record');
            $table->string('status_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_transactions');
    }
};
