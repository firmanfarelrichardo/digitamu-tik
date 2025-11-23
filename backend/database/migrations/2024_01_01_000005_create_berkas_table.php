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
        Schema::create('berkas', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('id_peminjaman');
            $table->string('nama_file', 255);
            $table->string('path_file', 500);
            $table->timestamp('create_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            
            $table->foreign('id_peminjaman')->references('id')->on('peminjaman')->onDelete('cascade');
        });

        DB::statement('COMMENT ON TABLE berkas IS \'File lampiran untuk syarat peminjaman\'');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berkas');
    }
};
