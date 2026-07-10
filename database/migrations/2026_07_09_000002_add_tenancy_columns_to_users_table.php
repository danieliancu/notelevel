<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('plan_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->string('role')->default('user')->after('plan_id');
            $table->unsignedInteger('max_canvas_pages_override')->nullable();
            $table->unsignedInteger('max_pdfs_override')->nullable();
            $table->unsignedBigInteger('ai_monthly_token_cap_override')->nullable();
            $table->timestamp('ai_usage_reset_at')->nullable();
            $table->index('plan_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['plan_id']);
            $table->dropColumn([
                'plan_id',
                'role',
                'max_canvas_pages_override',
                'max_pdfs_override',
                'ai_monthly_token_cap_override',
                'ai_usage_reset_at',
            ]);
        });
    }
};
