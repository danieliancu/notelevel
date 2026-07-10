<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('og_title')->nullable()->after('meta_description');
            $table->string('og_description')->nullable()->after('og_title');
            $table->string('og_image_path')->nullable()->after('og_description');
            $table->string('canonical_url')->nullable()->after('og_image_path');
            $table->string('focus_keyword')->nullable()->after('canonical_url');
            $table->unsignedTinyInteger('seo_score')->nullable()->after('focus_keyword');
            $table->boolean('noindex')->default(false)->after('seo_score');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'og_title',
                'og_description',
                'og_image_path',
                'canonical_url',
                'focus_keyword',
                'seo_score',
                'noindex',
            ]);
        });
    }
};
