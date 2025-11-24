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
    
    /**
     * The name of the "created at" column.
     */
    const CREATED_AT = 'create_at';
    
    /**
     * The name of the "updated at" column.
     */
    const UPDATED_AT = null;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = ['id'];

    /**
     * Get the peminjaman that owns the berkas.
     */
    public function peminjaman(): BelongsTo
    {
        return $this->belongsTo(Peminjaman::class, 'id_peminjaman');
    }
}
