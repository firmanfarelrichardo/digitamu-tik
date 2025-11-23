<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJanjiTemuRequest;
use App\Http\Requests\StorePeminjamanRequest;
use App\Models\Berkas;
use App\Models\Kunjungan;
use App\Models\Peminjaman;
use App\Models\Tamu;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    /**
     * Display the landing page.
     */
    public function index(): Response
    {
        return Inertia::render('Welcome');
    }

    /**
     * Show the form for creating a new appointment.
     */
    public function createJanji(): Response
    {
        $staffOptions = [
            'Kepala UPT TIK',
            'Staff IT Support',
            'Staff Jaringan',
            'Staff Multimedia',
            'Staff Administrasi',
        ];

        return Inertia::render('JanjiTemu', [
            'staffOptions' => $staffOptions,
        ]);
    }

    /**
     * Store a newly created appointment in storage.
     */
    public function storeJanji(StoreJanjiTemuRequest $request)
    {
        try {
            DB::beginTransaction();

            // Find or create tamu based on email
            $tamu = Tamu::firstOrCreate(
                ['email' => $request->email],
                [
                    'nama' => $request->nama,
                    'no_telp' => $request->no_telp,
                ]
            );

            // Update tamu info if email exists but data has changed
            if (!$tamu->wasRecentlyCreated) {
                $tamu->update([
                    'nama' => $request->nama,
                    'no_telp' => $request->no_telp,
                ]);
            }

            // Create kunjungan with combined keperluan
            $keperluan = "Bertemu dengan: {$request->bertemu_siapa}\n\nTopik Diskusi:\n{$request->topik_diskusi}";
            
            $kunjungan = Kunjungan::create([
                'id_tamu' => $tamu->id,
                'keperluan' => $keperluan,
                'waktu_janji_temu' => $request->waktu_janji_temu,
                'status' => 'menunggu',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Janji temu berhasil dibuat! Silakan tunggu konfirmasi dari staff.',
                'data' => $kunjungan
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new facility loan request.
     */
    public function createPinjam(): Response
    {
        $fasilitasOptions = [
            'Ruang Multimedia',
            'Ruang Meeting',
            'Proyektor',
            'Laptop',
            'Kamera',
            'Tripod',
            'Microphone',
            'Sound System',
            'LED Screen',
        ];

        return Inertia::render('Peminjaman', [
            'fasilitasOptions' => $fasilitasOptions,
        ]);
    }

    /**
     * Store a newly created facility loan request in storage.
     */
    public function storePinjam(StorePeminjamanRequest $request)
    {
        try {
            DB::beginTransaction();

            // Find or create tamu based on email
            $tamu = Tamu::firstOrCreate(
                ['email' => $request->email],
                [
                    'nama' => $request->nama,
                    'instansi' => $request->instansi,
                ]
            );

            // Update tamu info if email exists but data has changed
            if (!$tamu->wasRecentlyCreated) {
                $tamu->update([
                    'nama' => $request->nama,
                    'instansi' => $request->instansi,
                ]);
            }

            // Create kunjungan for the loan period (using start date as janji temu)
            $keperluan = "Peminjaman Fasilitas: {$request->fasilitas}\n\nPeriode: {$request->tanggal_mulai} s/d {$request->tanggal_selesai}";
            if ($request->detail_kebutuhan) {
                $keperluan .= "\n\nDetail Kebutuhan:\n{$request->detail_kebutuhan}";
            }

            $kunjungan = Kunjungan::create([
                'id_tamu' => $tamu->id,
                'keperluan' => $keperluan,
                'waktu_janji_temu' => $request->tanggal_mulai,
                'status' => 'menunggu',
            ]);

            // Create peminjaman
            $peminjaman = Peminjaman::create([
                'id_kunjungan' => $kunjungan->id,
                'judul_permohonan' => $request->fasilitas,
                'detail_kebutuhan' => $request->detail_kebutuhan,
                'status' => 'diajukan',
            ]);

            // Handle file upload
            if ($request->hasFile('surat_pengantar')) {
                $file = $request->file('surat_pengantar');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('surat-pengantar', $fileName, 'public');

                Berkas::create([
                    'id_peminjaman' => $peminjaman->id,
                    'nama_file' => $fileName,
                    'path_file' => $filePath,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Permohonan peminjaman berhasil diajukan! Silakan tunggu konfirmasi dari staff.',
                'data' => $peminjaman
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
