<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favourites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 80);
            $table->foreignId('pdf_folder_id')->nullable()->constrained('pdf_folders')->nullOnDelete();
            $table->foreignId('source_pdf_id')->nullable()->constrained('pdfs')->nullOnDelete();
            $table->unsignedInteger('source_page_index')->nullable();
            $table->timestamp('added_at');
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favourites');
    }
};
