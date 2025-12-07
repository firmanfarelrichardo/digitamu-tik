<?php

namespace Database\Seeders;

use App\Models\Kunjungan;
use App\Models\Peminjaman;
use App\Models\Tamu;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default Admin
        User::create([
            'name' => 'Kepala UPA TIK',
            'email' => 'admin@tik.unila.ac.id',
            'nip' => '198501012010011001',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create sample Staff
        User::create([
            'name' => 'Staff Front Office',
            'email' => 'staff@tik.unila.ac.id',
            'nip' => '199001012015011001',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Teknisi Jaringan',
            'email' => 'teknisi@tik.unila.ac.id',
            'nip' => '199203032018011001',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'is_active' => true,
        ]);

        // Create sample Tamu (Guests)
        $tamu1 = Tamu::create([
            'nama' => 'Ahmad Dahlan',
            'email' => 'ahmad.dahlan@gmail.com',
            'no_telp' => '081234567890',
            'instansi' => 'Fakultas Hukum',
        ]);

        $tamu2 = Tamu::create([
            'nama' => 'Siti Aminah',
            'email' => 'siti.aminah@student.unila.ac.id',
            'no_telp' => '082345678901',
            'instansi' => 'Mahasiswa FEB',
        ]);

        $tamu3 = Tamu::create([
            'nama' => 'Budi Santoso',
            'email' => 'budi.santoso@telkom.co.id',
            'no_telp' => '083456789012',
            'instansi' => 'PT. Telkom Indonesia',
        ]);

        $tamu4 = Tamu::create([
            'nama' => 'Prof. Dr. Irwan',
            'email' => 'irwan@unila.ac.id',
            'no_telp' => '084567890123',
            'instansi' => 'Rektorat',
        ]);

        $tamu5 = Tamu::create([
            'nama' => 'Dewi Lestari',
            'email' => 'dewi.lestari@gmail.com',
            'no_telp' => '085678901234',
            'instansi' => 'Dinas Pendidikan',
        ]);

        $today = Carbon::today();

        // Kunjungan hari ini (untuk Buku Tamu Harian)
        $kunjungan1 = Kunjungan::create([
            'id_tamu' => $tamu1->id,
            'keperluan' => 'Konsultasi Jaringan - Bertemu Staff IT Support',
            'waktu_janji_temu' => $today->copy()->setTime(9, 15),
            'waktu_checkin' => $today->copy()->setTime(9, 15),
            'waktu_checkout' => $today->copy()->setTime(10, 45),
            'status' => 'selesai',
        ]);

        $kunjungan2 = Kunjungan::create([
            'id_tamu' => $tamu2->id,
            'keperluan' => 'Reset Password SSO - Bertemu Staff Administrasi',
            'waktu_janji_temu' => $today->copy()->setTime(10, 30),
            'waktu_checkin' => $today->copy()->setTime(10, 30),
            'waktu_checkout' => null,
            'status' => 'disetujui',
        ]);

        $kunjungan3 = Kunjungan::create([
            'id_tamu' => $tamu3->id,
            'keperluan' => 'Layanan Server - Bertemu Kepala UPT TIK',
            'waktu_janji_temu' => $today->copy()->setTime(11, 0),
            'waktu_checkin' => $today->copy()->setTime(11, 0),
            'waktu_checkout' => $today->copy()->setTime(12, 0),
            'status' => 'selesai',
        ]);

        $kunjungan4 = Kunjungan::create([
            'id_tamu' => $tamu4->id,
            'keperluan' => 'Rapat Pimpinan - Bertemu Kepala UPT TIK',
            'waktu_janji_temu' => $today->copy()->setTime(8, 0),
            'waktu_checkin' => $today->copy()->setTime(8, 0),
            'waktu_checkout' => null,
            'status' => 'disetujui',
        ]);

        // Kunjungan kemarin
        $yesterday = $today->copy()->subDay();
        $kunjungan5 = Kunjungan::create([
            'id_tamu' => $tamu5->id,
            'keperluan' => 'Studi Banding - Bertemu Kepala UPT TIK',
            'waktu_janji_temu' => $yesterday->copy()->setTime(9, 0),
            'waktu_checkin' => $yesterday->copy()->setTime(9, 0),
            'waktu_checkout' => $yesterday->copy()->setTime(11, 30),
            'status' => 'selesai',
        ]);

        // Beberapa kunjungan lain di bulan ini
        for ($i = 2; $i <= 10; $i++) {
            $date = $today->copy()->subDays($i);
            Kunjungan::create([
                'id_tamu' => $tamu1->id,
                'keperluan' => 'Konsultasi Teknis #' . $i,
                'waktu_janji_temu' => $date->copy()->setTime(10, 0),
                'waktu_checkin' => $date->copy()->setTime(10, 0),
                'waktu_checkout' => $date->copy()->setTime(11, 0),
                'status' => 'selesai',
            ]);
        }

        // Create sample Peminjaman (pending)
        Peminjaman::create([
            'id_kunjungan' => $kunjungan3->id,
            'judul_permohonan' => 'Peminjaman Ruang Meeting',
            'detail_kebutuhan' => 'Untuk rapat koordinasi tim IT',
            'status' => 'diajukan',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjungan5->id,
            'judul_permohonan' => 'Peminjaman Proyektor',
            'detail_kebutuhan' => 'Untuk presentasi studi banding',
            'status' => 'diajukan',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjungan4->id,
            'judul_permohonan' => 'Peminjaman Laptop',
            'detail_kebutuhan' => 'Untuk demo sistem baru',
            'status' => 'diajukan',
        ]);
        // Seed kunjungan data
        $this->call(KunjunganSeeder::class);
    }
}
