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
        Schema::create('tamu', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('nama', 100);
            $table->string('email', 100);
            $table->string('no_telp', 20)->nullable();
            $table->string('instansi', 150)->nullable();
            $table->timestamp('create_at')->default(DB::raw('CURRENT_TIMESTAMP'));
        });

        DB::statement('COMMENT ON TABLE tamu IS \'Data master pengunjung/tamu\'');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tamu');
    }
};
