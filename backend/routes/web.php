<?php

use App\Http\Controllers\GuestController;
use Illuminate\Support\Facades\Route;

// Guest Routes (Sisi Tamu)
Route::name('guest.')->group(function () {
    Route::get('/', [GuestController::class, 'index'])->name('index');
    Route::get('/janji-temu', [GuestController::class, 'createJanji'])->name('janji-temu.create');
    Route::post('/janji-temu', [GuestController::class, 'storeJanji'])->name('janji-temu.store');
    Route::get('/peminjaman', [GuestController::class, 'createPinjam'])->name('peminjaman.create');
    Route::post('/peminjaman', [GuestController::class, 'storePinjam'])->name('peminjaman.store');
});
