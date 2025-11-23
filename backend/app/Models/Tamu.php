<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tamu extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tamu';
    
    public $timestamps = false;
    
    const CREATED_AT = 'create_at';

    protected $fillable = [
        'nama',
        'email',
        'no_telp',
        'instansi',
    ];

    /**
     * Get the kunjungan for the tamu.
     */
    public function kunjungan(): HasMany
    {
        return $this->hasMany(Kunjungan::class, 'id_tamu');
    }
}
