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
        // Drop existing types if they exist (for migrate:fresh)
        DB::statement("DROP TYPE IF EXISTS status_peminjaman CASCADE");
        DB::statement("DROP TYPE IF EXISTS status_kunjungan CASCADE");
        DB::statement("DROP TYPE IF EXISTS peran_pengguna CASCADE");
        
        // Create the types
        DB::statement("CREATE TYPE peran_pengguna AS ENUM ('admin', 'staff')");
        DB::statement("CREATE TYPE status_kunjungan AS ENUM ('menunggu', 'disetujui', 'ditolak', 'selesai')");
        DB::statement("CREATE TYPE status_peminjaman AS ENUM ('diajukan', 'disetujui', 'dipinjam', 'ditolak', 'selesai')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP TYPE IF EXISTS status_peminjaman CASCADE");
        DB::statement("DROP TYPE IF EXISTS status_kunjungan CASCADE");
        DB::statement("DROP TYPE IF EXISTS peran_pengguna CASCADE");
    }
};
