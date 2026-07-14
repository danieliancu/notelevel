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
        // A page duplicated in a PDF's page_order can now be imported once
        // per occurrence (each duplicate slot locks independently), instead
        // of the whole source page locking for every occurrence at once.
        Schema::table('pdf_page_imports', function (Blueprint $table) {
            // Add the replacement (non-unique) index before dropping the
            // unique one — MySQL/InnoDB needs an index covering pdf_id to
            // keep supporting its foreign key at all times.
            $table->index(['pdf_id', 'page_index'], 'pdf_page_imports_pdf_id_page_index_index');
        });

        Schema::table('pdf_page_imports', function (Blueprint $table) {
            $table->dropUnique(['pdf_id', 'page_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pdf_page_imports', function (Blueprint $table) {
            $table->unique(['pdf_id', 'page_index'], 'pdf_page_imports_pdf_id_page_index_unique');
        });

        Schema::table('pdf_page_imports', function (Blueprint $table) {
            $table->dropIndex('pdf_page_imports_pdf_id_page_index_index');
        });
    }
};
