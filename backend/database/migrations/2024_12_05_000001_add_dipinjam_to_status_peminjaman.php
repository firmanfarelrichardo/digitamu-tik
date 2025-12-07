<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'dipinjam' value to status_peminjaman ENUM
        DB::statement("ALTER TYPE status_peminjaman ADD VALUE IF NOT EXISTS 'dipinjam'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot remove enum values in PostgreSQL without recreating the type
    }
};
