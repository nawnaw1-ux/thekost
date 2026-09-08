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
            $table->string('owner_confirmation_token')->nullable()->unique()->after('external_id');
            $table->string('owner_confirmation_status')->nullable()->after('status');
            $table->timestamp('owner_confirmation_requested_at')->nullable()->after('owner_confirmation_status');
            $table->timestamp('owner_confirmation_at')->nullable()->after('owner_confirmation_requested_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropUnique('payments_owner_confirmation_token_unique');
            $table->dropColumn([
                'owner_confirmation_token',
                'owner_confirmation_status',
                'owner_confirmation_requested_at',
                'owner_confirmation_at',
            ]);
        });
    }
};
