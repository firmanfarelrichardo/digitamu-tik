<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Peminjaman extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'peminjaman';
    
    public $timestamps = false;

    protected $fillable = [
        'id_kunjungan',
        'judul_permohonan',
        'detail_kebutuhan',
        'status',
    ];

    /**
     * Get the kunjungan that owns the peminjaman.
     */
    public function kunjungan(): BelongsTo
    {
        return $this->belongsTo(Kunjungan::class, 'id_kunjungan');
    }

    /**
     * Get the berkas for the peminjaman.
     */
    public function berkas(): HasMany
    {
        return $this->hasMany(Berkas::class, 'id_peminjaman');
    }
}
