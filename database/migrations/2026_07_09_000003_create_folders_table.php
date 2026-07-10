<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('folders')->nullOnDelete();
            $table->string('name', 80);
            $table->timestamps();

            $table->unique(['user_id', 'parent_id', 'name']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folders');
    }
};
