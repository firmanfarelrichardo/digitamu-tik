<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('id_kunjungan');
            $table->string('judul_permohonan', 200);
            $table->text('detail_kebutuhan')->nullable();
            
            $table->foreign('id_kunjungan')->references('id')->on('kunjungan')->onDelete('cascade');
        });

        // Add status column with ENUM type
        DB::statement("ALTER TABLE peminjaman ADD COLUMN status status_peminjaman DEFAULT 'diajukan'");
        
        DB::statement('COMMENT ON TABLE peminjaman IS \'Data permohonan peminjaman barang/ruangan saat kunjungan\'');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
