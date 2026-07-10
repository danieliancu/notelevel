<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->uuid('last_autosave_key')->nullable()->after('version');
            $table->unsignedBigInteger('last_autosave_version')->nullable()->after('last_autosave_key');
            $table->string('last_autosave_hash', 64)->nullable()->after('last_autosave_version');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['last_autosave_key', 'last_autosave_version', 'last_autosave_hash']);
        });
    }
};
