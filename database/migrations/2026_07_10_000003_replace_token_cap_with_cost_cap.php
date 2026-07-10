<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->decimal('ai_monthly_cost_cap_gbp', 8, 4)->nullable()->after('ai_monthly_token_cap');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->decimal('ai_monthly_cost_cap_gbp_override', 8, 4)->nullable()->after('ai_monthly_token_cap_override');
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn('ai_monthly_token_cap');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('ai_monthly_token_cap_override');
        });
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->unsignedBigInteger('ai_monthly_token_cap')->nullable();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('ai_monthly_token_cap_override')->nullable();
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn('ai_monthly_cost_cap_gbp');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('ai_monthly_cost_cap_gbp_override');
        });
    }
};
