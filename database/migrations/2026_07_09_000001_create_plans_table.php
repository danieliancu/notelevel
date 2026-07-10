<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->unsignedInteger('price_cents')->default(0);
            $table->string('billing_interval')->nullable();
            $table->unsignedInteger('max_canvas_pages')->nullable();
            $table->unsignedInteger('max_pdfs')->nullable();
            $table->unsignedInteger('max_favourites')->nullable();
            $table->json('ai_actions_allowed');
            $table->unsignedBigInteger('ai_monthly_token_cap')->nullable();
            $table->boolean('is_default')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
