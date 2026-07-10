<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('folder_id')->nullable()->constrained('folders')->nullOnDelete();
            $table->string('title', 80);
            $table->json('content')->nullable();
            $table->string('guide_mode')->default('none');
            $table->boolean('guides_visible')->default(false);
            $table->string('page_background_color', 7)->default('#ffffff');
            $table->unsignedInteger('page_count')->default(0);
            $table->unsignedBigInteger('version')->default(1);
            $table->timestamps();

            $table->index(['user_id', 'updated_at']);
            $table->unique(['user_id', 'folder_id', 'title']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
