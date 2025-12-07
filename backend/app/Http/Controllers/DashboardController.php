<?php

namespace App\Http\Controllers;

use App\Models\Kunjungan;
use App\Models\Peminjaman;
use App\Models\Tamu;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Total tamu bulan ini
        $totalTamuBulanan = Kunjungan::whereBetween('create_at', [$startOfMonth, $endOfMonth])->count();

        // Rata-rata harian (total kunjungan bulan ini / jumlah hari yang sudah berlalu)
        $daysElapsed = $now->day;
        $rataRataHarian = $daysElapsed > 0 ? round($totalTamuBulanan / $daysElapsed) : 0;

        // Total staff aktif
        $totalStaffAktif = User::where('is_active', true)->count();

        // Peminjaman pending
        $peminjamanPending = Peminjaman::where('status', 'diajukan')->count();

        return response()->json([
            'total_tamu_bulanan' => $totalTamuBulanan,
            'rata_rata_harian' => $rataRataHarian,
            'total_staff_aktif' => $totalStaffAktif,
            'peminjaman_pending' => $peminjamanPending,
        ]);
    }

    /**
     * Get today's guest book (Buku Tamu Harian)
     */
    public function bukuTamuHarian(Request $request)
    {
        $today = Carbon::today();

        $kunjungan = Kunjungan::with(['tamu'])
            ->whereDate('create_at', $today)
            ->orderBy('waktu_janji_temu', 'asc')
            ->get()
            ->map(function ($item, $index) {
                // Calculate duration if checked out
                $durasi = null;
                if ($item->waktu_checkin && $item->waktu_checkout) {
                    $checkin = Carbon::parse($item->waktu_checkin);
                    $checkout = Carbon::parse($item->waktu_checkout);
                    $diffInMinutes = $checkin->diffInMinutes($checkout);
                    $hours = floor($diffInMinutes / 60);
                    $minutes = $diffInMinutes % 60;
                    $durasi = "{$hours}j {$minutes}m";
                }

                // Determine display status
                $status = $item->status;
                $statusDisplay = match($status) {
                    'menunggu' => 'Menunggu',
                    'disetujui' => 'Disetujui',
                    'ditolak' => 'Ditolak',
                    'selesai' => 'Selesai',
                    default => $status,
                };

                // Check if currently in room (checked in but not checked out)
                if ($item->waktu_checkin && !$item->waktu_checkout && $status !== 'selesai') {
                    $statusDisplay = 'Di Ruangan';
                }

                return [
                    'no' => $index + 1,
                    'id' => $item->id,
                    'nama' => $item->tamu->nama ?? '-',
                    'keperluan' => $item->keperluan,
                    'instansi' => $item->tamu->instansi ?? '-',
                    'waktu_masuk' => $item->waktu_checkin 
                        ? Carbon::parse($item->waktu_checkin)->format('H:i') 
                        : Carbon::parse($item->waktu_janji_temu)->format('H:i'),
                    'waktu_keluar' => $item->waktu_checkout 
                        ? Carbon::parse($item->waktu_checkout)->format('H:i') 
                        : null,
                    'durasi' => $durasi,
                    'status' => $statusDisplay,
                    'status_raw' => $status,
                    'belum_checkout' => $item->waktu_checkin && !$item->waktu_checkout,
                    'petugas' => 'Staff', // TODO: Add petugas field if needed
                ];
            });

        return response()->json([
            'tanggal' => $today->format('d F Y'),
            'data' => $kunjungan,
        ]);
    }

    /**
     * Get all kunjungan with pagination
     */
    public function semuaKunjungan(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $status = $request->input('status');
        $search = $request->input('search');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Kunjungan::with(['tamu', 'peminjaman']);

        // Filter by status
        if ($status) {
            $query->where('status', $status);
        }

        // Filter by date range
        if ($startDate && $endDate) {
            $query->whereBetween('create_at', [$startDate, $endDate]);
        }

        // Search by name or keperluan
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('keperluan', 'ilike', "%{$search}%")
                  ->orWhereHas('tamu', function ($q2) use ($search) {
                      $q2->where('nama', 'ilike', "%{$search}%")
                         ->orWhere('instansi', 'ilike', "%{$search}%");
                  });
            });
        }

        $kunjungan = $query->orderBy('create_at', 'desc')->paginate($perPage);

        return response()->json($kunjungan);
    }
}
