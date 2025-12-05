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
        Schema::create('kunjungan', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->uuid('id_tamu');
            $table->text('keperluan');
            $table->timestampTz('waktu_janji_temu');
            $table->timestampTz('waktu_checkin')->nullable();
            $table->timestampTz('waktu_checkout')->nullable();
            $table->timestamp('create_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            
            $table->foreign('id_tamu')->references('id')->on('tamu')->onDelete('cascade');
        });

        // Add status column with ENUM type
        DB::statement("ALTER TABLE kunjungan ADD COLUMN status status_kunjungan DEFAULT 'menunggu'");
        
        DB::statement('COMMENT ON TABLE kunjungan IS \'Mencatat setiap sesi kunjungan atau janji temu\'');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kunjungan');
    }
};
