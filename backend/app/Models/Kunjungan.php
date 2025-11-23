<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Kunjungan extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'kunjungan';
    
    public $timestamps = false;
    
    const CREATED_AT = 'create_at';

    protected $fillable = [
        'id_tamu',
        'keperluan',
        'waktu_janji_temu',
        'waktu_checkin',
        'waktu_checkout',
        'status',
    ];

    protected $casts = [
        'waktu_janji_temu' => 'datetime',
        'waktu_checkin' => 'datetime',
        'waktu_checkout' => 'datetime',
    ];

    /**
     * Get the tamu that owns the kunjungan.
     */
    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class, 'id_tamu');
    }

    /**
     * Get the peminjaman associated with the kunjungan.
     */
    public function peminjaman(): HasOne
    {
        return $this->hasOne(Peminjaman::class, 'id_kunjungan');
    }
}
