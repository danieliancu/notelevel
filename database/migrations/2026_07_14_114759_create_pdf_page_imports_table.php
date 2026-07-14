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
        Schema::create('pdf_page_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pdf_id')->constrained('pdfs')->cascadeOnDelete();
            $table->unsignedInteger('page_index');
            $table->foreignId('document_id')->nullable()->constrained('documents')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['pdf_id', 'page_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pdf_page_imports');
    }
};
