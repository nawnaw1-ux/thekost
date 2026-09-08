<?php

use App\Models\Bill;
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
        Schema::table('bills', function (Blueprint $table) {
            $table->unsignedSmallInteger('unique_code')->nullable()->unique()->after('penalty_day');
            $table->unsignedInteger('transfer_amount')->nullable()->after('unique_code');
        });

        Bill::query()
            ->orderBy('id')
            ->get()
            ->each(function (Bill $bill) {
                $bill->ensurePaymentCode();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropUnique(['unique_code']);
            $table->dropColumn(['unique_code', 'transfer_amount']);
        });
    }
};
