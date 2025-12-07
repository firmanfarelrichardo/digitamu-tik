<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Mail\StatusKonfirmasi;
use App\Models\Kunjungan;
use App\Models\Peminjaman;
use App\Models\Tamu;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class StaffController extends Controller
{
    /**
     * Display a listing of staff members.
     */
    public function index()
    {
        $staff = User::orderBy('created_at', 'desc')->get();
        
        return response()->json($staff);
    }

    /**
     * Store a newly created staff member.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['nullable', 'string', 'max:20', 'unique:users,nip'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', 'in:admin,staff'],
            'is_active' => ['required', 'boolean'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'nip' => $validated['nip'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => $validated['is_active'],
        ]);

        return response()->json([
            'message' => 'Staff berhasil ditambahkan',
            'data' => $user
        ], 201);
    }

    /**
     * Display the specified staff member.
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * Update the specified staff member.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['nullable', 'string', 'max:20', 'unique:users,nip,' . $user->id],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'role' => ['required', 'in:admin,staff'],
            'is_active' => ['required', 'boolean'],
        ]);

        $user->name = $validated['name'];
        $user->nip = $validated['nip'] ?? null;
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        $user->is_active = $validated['is_active'];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Staff berhasil diperbarui',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified staff member.
     */
    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if (auth()->id() === $user->id) {
            return response()->json([
                'message' => 'Tidak dapat menghapus akun sendiri'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Staff berhasil dihapus'
        ]);
    }

    /**
     * Get dashboard statistics and recent activities.
     */
    public function dashboard(): JsonResponse
    {
        $today = Carbon::today();

        // Statistics
        $totalTamuHariIni = Kunjungan::where(function($query) use ($today) {
                $query->whereDate('waktu_janji_temu', $today)
                    ->orWhereDate('waktu_checkin', $today);
            })
            ->whereIn('status', ['disetujui', 'selesai'])
            ->count();

        $sedangDiRuangan = Kunjungan::where('status', 'disetujui')
            ->whereNotNull('waktu_checkin')
            ->whereNull('waktu_checkout')
            ->count();

        $permohonanBaru = Kunjungan::where('status', 'menunggu')->count();

        // Recent activities - approved janji temu only (exclude peminjaman)
        $nextWeek = Carbon::today()->addDays(7);
        $aktivitasTerkini = Kunjungan::with('tamu')
            ->whereDoesntHave('peminjaman') // Only janji temu, not peminjaman
            ->whereIn('status', ['disetujui', 'selesai'])
            ->where(function ($query) use ($today, $nextWeek) {
                $query->whereDate('waktu_janji_temu', '>=', $today)
                    ->whereDate('waktu_janji_temu', '<=', $nextWeek);
            })
            ->orWhere(function ($query) use ($today) {
                $query->whereDoesntHave('peminjaman')
                    ->whereIn('status', ['disetujui', 'selesai'])
                    ->whereDate('waktu_checkin', $today);
            })
            ->orderByRaw('waktu_checkin IS NULL DESC') // Null checkin first (menunggu)
            ->orderBy('waktu_janji_temu', 'asc')
            ->orderBy('waktu_checkin', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($kunjungan) {
                $tamu = $kunjungan->tamu;
                $waktu = $kunjungan->waktu_checkin 
                    ? Carbon::parse($kunjungan->waktu_checkin)->format('H:i')
                    : Carbon::parse($kunjungan->waktu_janji_temu)->format('d M, H:i');

                // Determine status display based on checkin/checkout
                if ($kunjungan->status === 'selesai' || $kunjungan->waktu_checkout) {
                    $statusDisplay = 'Selesai';
                } elseif ($kunjungan->waktu_checkin) {
                    $statusDisplay = 'Di Dalam';
                } else {
                    $statusDisplay = 'Menunggu'; // Approved but not checked in yet
                }

                $jamMasuk = $kunjungan->waktu_checkin 
                    ? Carbon::parse($kunjungan->waktu_checkin)->format('H:i') 
                    : '-';
                $jamKeluar = $kunjungan->waktu_checkout 
                    ? Carbon::parse($kunjungan->waktu_checkout)->format('H:i') 
                    : '-';

                return [
                    'id' => $kunjungan->id,
                    'waktu' => $waktu,
                    'nama' => $tamu->nama ?? '-',
                    'instansi' => $tamu->instansi ?? '-',
                    'email' => $tamu->email ?? '-',
                    'noTelp' => $tamu->no_telp ?? '-',
                    'keperluan' => $this->extractKeperluan($kunjungan->keperluan),
                    'keperluanFull' => $kunjungan->keperluan,
                    'bertemu' => $this->extractBertemuSiapa($kunjungan->keperluan),
                    'status' => $statusDisplay,
                    'rawStatus' => $kunjungan->status,
                    'jamMasuk' => $jamMasuk,
                    'jamKeluar' => $jamKeluar,
                    'waktu_checkin' => $kunjungan->waktu_checkin,
                    'waktu_checkout' => $kunjungan->waktu_checkout,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'totalTamuHariIni' => $totalTamuHariIni,
                    'sedangDiRuangan' => $sedangDiRuangan,
                    'permohonanBaru' => $permohonanBaru,
                ],
                'aktivitasTerkini' => $aktivitasTerkini,
            ],
        ]);
    }

    /**
     * Get list of pending requests (janji temu & peminjaman).
     */
    public function getPermohonan(): JsonResponse
    {
        // Get pending janji temu (kunjungan without peminjaman)
        $janjiTemu = Kunjungan::with('tamu')
            ->where('status', 'menunggu')
            ->whereDoesntHave('peminjaman')
            ->orderBy('waktu_janji_temu', 'asc')
            ->get()
            ->map(function ($kunjungan) {
                $tamu = $kunjungan->tamu;
                return [
                    'id' => $kunjungan->id,
                    'type' => 'janji-temu',
                    'nama' => $tamu->nama,
                    'namaDisplay' => $tamu->nama . ' (' . ($tamu->instansi ?? 'Umum') . ')',
                    'instansi' => $tamu->instansi ?? 'Umum',
                    'email' => $tamu->email ?? '-',
                    'noTelp' => $tamu->no_telp ?? '-',
                    'deskripsi' => $kunjungan->keperluan,
                    'bertemuDengan' => $this->extractBertemuSiapa($kunjungan->keperluan),
                    'topikDiskusi' => $this->extractKeperluan($kunjungan->keperluan),
                    'tanggal' => Carbon::parse($kunjungan->waktu_janji_temu)->format('d M Y, H:i') . ' WIB',
                    'tanggalRaw' => Carbon::parse($kunjungan->waktu_janji_temu)->format('d M Y'),
                    'jamRaw' => Carbon::parse($kunjungan->waktu_janji_temu)->format('H:i') . ' WIB',
                    'lokasi' => $this->extractBertemuSiapa($kunjungan->keperluan),
                    'lampiran' => null,
                    'berkasUrl' => null,
                ];
            });

        // Get pending peminjaman
        $peminjaman = Peminjaman::with(['kunjungan.tamu', 'berkas'])
            ->where('status', 'diajukan')
            ->orderBy(
                Kunjungan::select('waktu_janji_temu')
                    ->whereColumn('kunjungan.id', 'peminjaman.id_kunjungan')
                    ->limit(1),
                'asc'
            )
            ->get()
            ->map(function ($pinjam) {
                $tamu = $pinjam->kunjungan->tamu;
                $kunjungan = $pinjam->kunjungan;
                $hasBerkas = $pinjam->berkas->count() > 0;
                $berkasUrl = $hasBerkas ? asset('storage/' . $pinjam->berkas->first()->path_file) : null;

                return [
                    'id' => $pinjam->id,
                    'kunjungan_id' => $kunjungan->id,
                    'type' => 'peminjaman',
                    'nama' => $tamu->nama,
                    'namaDisplay' => $tamu->nama . ' (' . ($tamu->instansi ?? 'Umum') . ')',
                    'instansi' => $tamu->instansi ?? 'Umum',
                    'email' => $tamu->email ?? '-',
                    'noTelp' => $tamu->no_telp ?? '-',
                    'judulPermohonan' => $pinjam->judul_permohonan,
                    'detailKebutuhan' => $pinjam->detail_kebutuhan,
                    'deskripsi' => $pinjam->judul_permohonan . ($pinjam->detail_kebutuhan ? ': ' . $pinjam->detail_kebutuhan : ''),
                    'tanggal' => Carbon::parse($kunjungan->waktu_janji_temu)->format('d M Y, H:i') . ' WIB',
                    'tanggalMulai' => Carbon::parse($kunjungan->waktu_janji_temu)->format('d M Y'),
                    'tanggalSelesai' => $kunjungan->waktu_checkout 
                        ? Carbon::parse($kunjungan->waktu_checkout)->format('d M Y') 
                        : '-',
                    'lokasi' => null,
                    'lampiran' => $hasBerkas ? 'Ada Lampiran Surat' : null,
                    'hasBerkas' => $hasBerkas,
                    'berkasUrl' => $berkasUrl,
                ];
            });

        // Merge and sort by date
        $permohonanList = $janjiTemu->concat($peminjaman)
            ->sortBy('tanggal')
            ->values();

        return response()->json([
            'success' => true,
            'data' => $permohonanList,
        ]);
    }

    /**
     * Approve a request (janji temu or peminjaman).
     */
    public function approvePermohonan(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|string',
            'type' => 'required|in:janji-temu,peminjaman',
        ]);

        try {
            DB::beginTransaction();

            $tamu = null;
            $details = [];

            if ($request->type === 'janji-temu') {
                $kunjungan = Kunjungan::with('tamu')->findOrFail($request->id);
                $kunjungan->update(['status' => 'disetujui']);
                
                $tamu = $kunjungan->tamu;
                $details = [
                    'id' => $kunjungan->id,
                    'tanggal' => Carbon::parse($kunjungan->waktu_janji_temu)->locale('id')->isoFormat('dddd, D MMMM YYYY'),
                    'jam' => Carbon::parse($kunjungan->waktu_janji_temu)->format('H:i') . ' WIB',
                    'keperluan' => $kunjungan->keperluan,
                ];
            } else {
                $peminjaman = Peminjaman::with('kunjungan.tamu')->findOrFail($request->id);
                $peminjaman->update(['status' => 'disetujui']);
                
                // Also update the related kunjungan
                $peminjaman->kunjungan->update(['status' => 'disetujui']);
                
                $tamu = $peminjaman->kunjungan->tamu;
                $details = [
                    'id' => $peminjaman->id,
                    'judul' => $peminjaman->judul_permohonan,
                    'detail' => $peminjaman->detail_kebutuhan,
                    'tanggalMulai' => Carbon::parse($peminjaman->kunjungan->waktu_janji_temu)->locale('id')->isoFormat('D MMMM YYYY'),
                    'tanggalSelesai' => $peminjaman->kunjungan->waktu_checkout 
                        ? Carbon::parse($peminjaman->kunjungan->waktu_checkout)->locale('id')->isoFormat('D MMMM YYYY')
                        : '-',
                ];
            }

            DB::commit();

            // Send email notification
            if ($tamu && $tamu->email) {
                try {
                    Mail::to($tamu->email)->send(new StatusKonfirmasi(
                        $tamu,
                        $request->type,
                        'disetujui',
                        $details
                    ));
                } catch (\Exception $e) {
                    // Log email error but don't fail the request
                    Log::error('Failed to send approval email: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan berhasil disetujui.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyetujui permohonan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a request (janji temu or peminjaman).
     */
    public function rejectPermohonan(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|string',
            'type' => 'required|in:janji-temu,peminjaman',
            'alasan_penolakan' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $tamu = null;
            $details = [];

            if ($request->type === 'janji-temu') {
                $kunjungan = Kunjungan::with('tamu')->findOrFail($request->id);
                $kunjungan->update(['status' => 'ditolak']);
                
                $tamu = $kunjungan->tamu;
                $details = [
                    'id' => $kunjungan->id,
                    'tanggal' => Carbon::parse($kunjungan->waktu_janji_temu)->locale('id')->isoFormat('dddd, D MMMM YYYY'),
                    'jam' => Carbon::parse($kunjungan->waktu_janji_temu)->format('H:i') . ' WIB',
                    'keperluan' => $kunjungan->keperluan,
                    'alasan_penolakan' => $request->alasan_penolakan,
                ];
            } else {
                $peminjaman = Peminjaman::with('kunjungan.tamu')->findOrFail($request->id);
                $peminjaman->update(['status' => 'ditolak']);
                
                // Also update the related kunjungan
                $peminjaman->kunjungan->update(['status' => 'ditolak']);
                
                $tamu = $peminjaman->kunjungan->tamu;
                $details = [
                    'id' => $peminjaman->id,
                    'judul' => $peminjaman->judul_permohonan,
                    'detail' => $peminjaman->detail_kebutuhan,
                    'tanggalMulai' => Carbon::parse($peminjaman->kunjungan->waktu_janji_temu)->locale('id')->isoFormat('D MMMM YYYY'),
                    'tanggalSelesai' => $peminjaman->kunjungan->waktu_checkout 
                        ? Carbon::parse($peminjaman->kunjungan->waktu_checkout)->locale('id')->isoFormat('D MMMM YYYY')
                        : '-',
                    'alasan_penolakan' => $request->alasan_penolakan,
                ];
            }

            DB::commit();

            // Send email notification
            if ($tamu && $tamu->email) {
                try {
                    Mail::to($tamu->email)->send(new StatusKonfirmasi(
                        $tamu,
                        $request->type,
                        'ditolak',
                        $details
                    ));
                } catch (\Exception $e) {
                    // Log email error but don't fail the request
                    Log::error('Failed to send rejection email: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Permohonan berhasil ditolak.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menolak permohonan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check-in a visitor (set waktu_checkin).
     */
    public function checkinKunjungan(string $id): JsonResponse
    {
        try {
            $kunjungan = Kunjungan::findOrFail($id);
            
            if ($kunjungan->status !== 'disetujui') {
                return response()->json([
                    'success' => false,
                    'message' => 'Kunjungan belum disetujui.',
                ], 400);
            }

            $kunjungan->update([
                'waktu_checkin' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Check-in berhasil.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan check-in.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check-out a visitor (set waktu_checkout and status to selesai).
     */
    public function checkoutKunjungan(string $id): JsonResponse
    {
        try {
            $kunjungan = Kunjungan::findOrFail($id);

            $kunjungan->update([
                'waktu_checkout' => Carbon::now(),
                'status' => 'selesai',
            ]);

            // If there's a related peminjaman, also mark it as selesai
            if ($kunjungan->peminjaman) {
                $kunjungan->peminjaman->update(['status' => 'selesai']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Check-out berhasil.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan check-out.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get visit history with optional filters (janji temu only).
     */
    public function getRiwayat(Request $request): JsonResponse
    {
        $query = Kunjungan::with('tamu')
            ->whereDoesntHave('peminjaman') // Only janji temu
            ->whereIn('status', ['disetujui', 'selesai']);

        // Filter by search (nama or instansi)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('tamu', function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                    ->orWhere('instansi', 'ilike', "%{$search}%");
            });
        }

        // Filter by date
        if ($request->filled('tanggal')) {
            $tanggal = Carbon::parse($request->tanggal);
            $query->whereDate('waktu_janji_temu', $tanggal)
                ->orWhereDate('waktu_checkin', $tanggal);
        }

        $riwayat = $query->orderBy('waktu_janji_temu', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($kunjungan) {
                $tamu = $kunjungan->tamu;
                $waktuCheckin = $kunjungan->waktu_checkin 
                    ? Carbon::parse($kunjungan->waktu_checkin)->format('H:i') 
                    : '-';
                $waktuCheckout = $kunjungan->waktu_checkout 
                    ? Carbon::parse($kunjungan->waktu_checkout)->format('H:i') 
                    : '-';

                return [
                    'id' => $kunjungan->id,
                    'tanggal' => Carbon::parse($kunjungan->waktu_janji_temu)->format('d M Y'),
                    'nama' => $tamu->nama ?? '-',
                    'instansi' => $tamu->instansi ?? 'Umum',
                    'email' => $tamu->email ?? '-',
                    'noTelp' => $tamu->no_telp ?? '-',
                    'keperluan' => $this->extractKeperluan($kunjungan->keperluan),
                    'keperluanFull' => $kunjungan->keperluan,
                    'bertemu' => $this->extractBertemuSiapa($kunjungan->keperluan),
                    'jamMasuk' => $waktuCheckin,
                    'jamKeluar' => $waktuCheckout,
                    'status' => $kunjungan->status,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $riwayat,
        ]);
    }

    /**
     * Get peminjaman history with optional filters.
     */
    public function getRiwayatPeminjaman(Request $request): JsonResponse
    {
        $query = Peminjaman::with(['kunjungan.tamu', 'berkas'])
            ->whereIn('status', ['disetujui', 'dipinjam', 'selesai']);

        // Filter by search (nama or instansi)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('kunjungan.tamu', function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                    ->orWhere('instansi', 'ilike', "%{$search}%");
            });
        }

        // Filter by date
        if ($request->filled('tanggal')) {
            $tanggal = Carbon::parse($request->tanggal);
            $query->whereHas('kunjungan', function ($q) use ($tanggal) {
                $q->whereDate('waktu_janji_temu', $tanggal)
                    ->orWhereDate('waktu_checkin', $tanggal);
            });
        }

        $riwayat = $query->orderBy(
                Kunjungan::select('waktu_janji_temu')
                    ->whereColumn('kunjungan.id', 'peminjaman.id_kunjungan')
                    ->limit(1),
                'desc'
            )
            ->limit(50)
            ->get()
            ->map(function ($peminjaman) {
                $kunjungan = $peminjaman->kunjungan;
                $tamu = $kunjungan->tamu;
                
                // tanggal_mulai = waktu_janji_temu, tanggal_selesai = waktu_checkout
                $tanggalMulai = Carbon::parse($kunjungan->waktu_janji_temu)->format('d M Y');
                $tanggalSelesai = $kunjungan->waktu_checkout 
                    ? Carbon::parse($kunjungan->waktu_checkout)->format('d M Y') 
                    : '-';

                // Map status untuk display
                $statusDisplay = match ($peminjaman->status) {
                    'disetujui' => 'Menunggu',
                    'dipinjam' => 'Dipinjam',
                    'selesai' => 'Selesai',
                    default => $peminjaman->status,
                };

                // Get berkas URL (first file if exists)
                $berkasUrl = null;
                if ($peminjaman->berkas->count() > 0) {
                    $berkasUrl = asset('storage/' . $peminjaman->berkas->first()->path_file);
                }

                return [
                    'id' => $peminjaman->id,
                    'kunjungan_id' => $kunjungan->id,
                    'nama' => $tamu->nama ?? '-',
                    'instansi' => $tamu->instansi ?? 'Umum',
                    'email' => $tamu->email ?? '-',
                    'noTelp' => $tamu->no_telp ?? '-',
                    'judulPermohonan' => $peminjaman->judul_permohonan,
                    'detailKebutuhan' => $peminjaman->detail_kebutuhan,
                    'rawStatus' => $peminjaman->status,
                    'status' => $statusDisplay,
                    'tanggalMulai' => $tanggalMulai,
                    'tanggalSelesai' => $tanggalSelesai,
                    'hasBerkas' => $peminjaman->berkas->count() > 0,
                    'berkasUrl' => $berkasUrl,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $riwayat,
        ]);
    }

    /**
     * Mark peminjaman as "dipinjam" (barang sedang dipinjam).
     */
    public function pinjamBarang(string $id): JsonResponse
    {
        try {
            $peminjaman = Peminjaman::findOrFail($id);
            
            if ($peminjaman->status !== 'disetujui') {
                return response()->json([
                    'success' => false,
                    'message' => 'Peminjaman belum disetujui atau sudah dipinjam.',
                ], 400);
            }

            $peminjaman->update(['status' => 'dipinjam']);
            
            // Update waktu_checkin di kunjungan sebagai waktu mulai pinjam
            $peminjaman->kunjungan->update([
                'waktu_checkin' => Carbon::now(),
                'status' => 'disetujui',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status peminjaman berhasil diubah menjadi dipinjam.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status peminjaman.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark peminjaman as "selesai" (barang sudah dikembalikan).
     */
    public function selesaiPeminjaman(string $id): JsonResponse
    {
        try {
            $peminjaman = Peminjaman::findOrFail($id);
            
            if ($peminjaman->status !== 'dipinjam') {
                return response()->json([
                    'success' => false,
                    'message' => 'Peminjaman belum dalam status dipinjam.',
                ], 400);
            }

            $peminjaman->update(['status' => 'selesai']);
            
            // Update kunjungan juga
            $peminjaman->kunjungan->update(['status' => 'selesai']);

            return response()->json([
                'success' => true,
                'message' => 'Peminjaman berhasil diselesaikan.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyelesaikan peminjaman.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export data to Excel/PDF (returns data for frontend to process).
     */
    public function exportExcel(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $kategori = $request->input('kategori', 'Semua Data');

        $query = Kunjungan::with(['tamu', 'peminjaman']);

        // Filter by date range
        if ($startDate && $endDate) {
            $query->where(function($q) use ($startDate, $endDate) {
                $q->whereBetween('waktu_janji_temu', [$startDate, $endDate . ' 23:59:59'])
                  ->orWhereBetween('waktu_checkin', [$startDate, $endDate . ' 23:59:59']);
            });
        }

        // Filter by kategori
        if ($kategori === 'Janji Temu') {
            $query->whereDoesntHave('peminjaman');
        } elseif ($kategori === 'Peminjaman') {
            $query->whereHas('peminjaman');
        }

        $data = $query->orderBy('create_at', 'desc')
            ->get()
            ->map(function ($kunjungan) {
                $isPeminjaman = $kunjungan->peminjaman !== null;
                
                return [
                    'tanggal' => Carbon::parse($kunjungan->create_at)->format('d/m/Y'),
                    'waktu' => $kunjungan->waktu_checkin 
                        ? Carbon::parse($kunjungan->waktu_checkin)->format('H:i')
                        : Carbon::parse($kunjungan->waktu_janji_temu)->format('H:i'),
                    'nama' => $kunjungan->tamu->nama ?? '-',
                    'email' => $kunjungan->tamu->email ?? '-',
                    'no_telp' => $kunjungan->tamu->no_telp ?? '-',
                    'instansi' => $kunjungan->tamu->instansi ?? '-',
                    'jenis' => $isPeminjaman ? 'Peminjaman' : 'Janji Temu',
                    'keperluan' => $isPeminjaman 
                        ? ($kunjungan->peminjaman->judul_permohonan ?? '-')
                        : $this->extractKeperluan($kunjungan->keperluan),
                    'status' => ucfirst($kunjungan->status),
                    'waktu_checkin' => $kunjungan->waktu_checkin 
                        ? Carbon::parse($kunjungan->waktu_checkin)->format('d/m/Y H:i')
                        : '-',
                    'waktu_checkout' => $kunjungan->waktu_checkout 
                        ? Carbon::parse($kunjungan->waktu_checkout)->format('d/m/Y H:i')
                        : '-',
                ];
            });

        $filename = 'laporan_kunjungan';
        if ($startDate && $endDate) {
            $filename .= '_' . $startDate . '_sd_' . $endDate;
        } else {
            $filename .= '_' . Carbon::today()->format('Y-m-d');
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'filename' => $filename,
            'total' => $data->count(),
        ]);
    }

    /**
     * Get detail of a specific kunjungan.
     */
    public function getDetailKunjungan(string $id): JsonResponse
    {
        $kunjungan = Kunjungan::with(['tamu', 'peminjaman.berkas'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $kunjungan->id,
                'tamu' => [
                    'nama' => $kunjungan->tamu->nama,
                    'email' => $kunjungan->tamu->email,
                    'no_telp' => $kunjungan->tamu->no_telp,
                    'instansi' => $kunjungan->tamu->instansi,
                ],
                'keperluan' => $kunjungan->keperluan,
                'waktu_janji_temu' => $kunjungan->waktu_janji_temu,
                'waktu_checkin' => $kunjungan->waktu_checkin,
                'waktu_checkout' => $kunjungan->waktu_checkout,
                'status' => $kunjungan->status,
                'peminjaman' => $kunjungan->peminjaman ? [
                    'id' => $kunjungan->peminjaman->id,
                    'judul' => $kunjungan->peminjaman->judul_permohonan,
                    'detail' => $kunjungan->peminjaman->detail_kebutuhan,
                    'status' => $kunjungan->peminjaman->status,
                    'berkas' => $kunjungan->peminjaman->berkas->map(function ($berkas) {
                        return [
                            'nama' => $berkas->nama_file,
                            'path' => $berkas->path_file,
                        ];
                    }),
                ] : null,
            ],
        ]);
    }

    /**
     * Extract keperluan from the full text (remove "Bertemu dengan:" part).
     */
    private function extractKeperluan(string $keperluan): string
    {
        // If it contains "Topik Diskusi:", extract that part
        if (str_contains($keperluan, 'Topik Diskusi:')) {
            $parts = explode('Topik Diskusi:', $keperluan);
            return trim($parts[1] ?? $keperluan);
        }
        
        return $keperluan;
    }

    /**
     * Extract "Bertemu dengan" from keperluan text.
     */
    private function extractBertemuSiapa(string $keperluan): string
    {
        // If it contains "Bertemu dengan:", extract that part
        if (str_contains($keperluan, 'Bertemu dengan:')) {
            preg_match('/Bertemu dengan:\s*([^\n]+)/', $keperluan, $matches);
            return trim($matches[1] ?? '-');
        }
        
        return '-';
    }
}
