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
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'checkout_link',
                'external_id',
                'payment_method',
                'payment_channel',
            ]);
        });

        Schema::dropIfExists('payment_gateways');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('XENDIT_API_KEY');
            $table->string('XENDIT_CALLBACK_TOKEN');
            $table->timestamps();
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->string('checkout_link')->nullable()->after('bill_id');
            $table->string('external_id')->nullable()->after('status');
            $table->string('payment_method')->nullable()->after('owner_confirmation_at');
            $table->string('payment_channel')->nullable()->after('payment_method');
        });
    }
};
