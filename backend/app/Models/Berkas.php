<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Berkas extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'berkas';
    
    public $timestamps = false;
    
    const CREATED_AT = 'create_at';

    protected $fillable = [
        'id_peminjaman',
        'nama_file',
        'path_file',
    ];

    /**
     * Get the peminjaman that owns the berkas.
     */
    public function peminjaman(): BelongsTo
    {
        return $this->belongsTo(Peminjaman::class, 'id_peminjaman');
    }
}
