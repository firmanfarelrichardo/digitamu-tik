<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJanjiTemuRequest;
use App\Http\Requests\StorePeminjamanRequest;
use App\Mail\JanjiTemuConfirmation;
use App\Mail\PeminjamanConfirmation;
use App\Models\Berkas;
use App\Models\Kunjungan;
use App\Models\Peminjaman;
use App\Models\Tamu;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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
                ]
            );

            // Update tamu info if email exists but data has changed
            if (!$tamu->wasRecentlyCreated) {
                $tamu->update([
                    'nama' => $request->nama,
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

            // Send confirmation email
            Mail::to($tamu->email)->send(new JanjiTemuConfirmation($kunjungan));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan Berhasil! Bukti formulir telah dikirim ke email Anda.',
                'data' => $kunjungan
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
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

            // Step A: Find or create guest by email
            $tamu = Tamu::firstOrCreate(
                ['email' => $request->email],
                [
                    'nama' => $request->nama,
                    'instansi' => $request->instansi,
                    'no_telp' => $request->no_telp,
                ]
            );

            // Update guest info if email exists but data has changed
            if (!$tamu->wasRecentlyCreated) {
                $tamu->update([
                    'nama' => $request->nama,
                    'instansi' => $request->instansi,
                    'no_telp' => $request->no_telp,
                ]);
            }

            // Step B: Create Visit (Kunjungan) with date range
            $keperluan = "Peminjaman Fasilitas";

            $kunjungan = Kunjungan::create([
                'id_tamu' => $tamu->id,
                'keperluan' => $keperluan,
                'waktu_janji_temu' => $request->tanggal_mulai, // Start date from form
                'waktu_checkout' => $request->tanggal_selesai,  // End date from form
                'status' => 'menunggu',
            ]);

            // Step C: Create Loan (Peminjaman)
            $peminjaman = Peminjaman::create([
                'id_kunjungan' => $kunjungan->id,
                'judul_permohonan' => $request->barang,
                'detail_kebutuhan' => $request->detail_kebutuhan,
                'status' => 'diajukan',
            ]);

            // Step D: Handle File Upload
            if ($request->hasFile('surat_pengantar')) {
                $file = $request->file('surat_pengantar');
                
                // Generate filename format: tanggalwaktu_barang_idpenomoran_suratpermohonan.ext
                $tanggalWaktu = date('Ymd_His'); // Format: 20251124_103045
                $barangSanitized = preg_replace('/[^a-zA-Z0-9]/', '_', $request->barang); // Sanitize facility name
                $idPenomoran = strtoupper(substr($peminjaman->id, 0, 8)); // First 8 chars of UUID
                $extension = $file->getClientOriginalExtension();
                
                // Final format: 20251124_103045_Ruang_Meeting_A1B2C3D4_suratpermohonan.pdf
                $filename = "{$tanggalWaktu}_{$barangSanitized}_{$idPenomoran}_suratpermohonan.{$extension}";
                
                // Store file with structured filename
                $path = $file->storeAs('uploads/surat_pengantar', $filename, 'public');
                
                // Create berkas record
                Berkas::create([
                    'id_peminjaman' => $peminjaman->id,
                    'nama_file' => $filename,
                    'path_file' => $path,
                ]);
            }

            // Step E: Send Confirmation Email
            Mail::to($tamu->email)->send(new PeminjamanConfirmation($peminjaman));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permohonan Berhasil! Bukti formulir telah dikirim ke email Anda.',
                'data' => [
                    'ticket_id' => strtoupper(substr($peminjaman->id, 0, 8)),
                    'peminjaman' => $peminjaman
                ]
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
