<?php

namespace Database\Seeders;

use App\Models\Berkas;
use App\Models\Kunjungan;
use App\Models\Peminjaman;
use App\Models\Tamu;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class KunjunganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $today = Carbon::today();

        // ===== TAMU UNTUK JANJI TEMU =====

        $tamuJanjiTemu1 = Tamu::create([
            'nama' => 'Ahmad Dahlan',
            'email' => 'ahmad.dahlan@mail.com',
            'no_telp' => '081234567890',
            'instansi' => 'Fakultas Hukum',
        ]);

        $tamuJanjiTemu2 = Tamu::create([
            'nama' => 'Siti Aminah',
            'email' => 'siti.aminah@student.unila.ac.id',
            'no_telp' => '082345678901',
            'instansi' => 'Mahasiswa FEB',
        ]);

        $tamuJanjiTemu3 = Tamu::create([
            'nama' => 'Budi Santoso',
            'email' => 'budi.santoso@gmail.com',
            'no_telp' => '083456789012',
            'instansi' => 'PT. Telkom Indonesia',
        ]);

        $tamuJanjiTemu4 = Tamu::create([
            'nama' => 'Rina Wulandari',
            'email' => 'rina.wulandari@unila.ac.id',
            'no_telp' => '084567890123',
            'instansi' => 'Fakultas Teknik',
        ]);

        $tamuJanjiTemu5 = Tamu::create([
            'nama' => 'Dedi Corbuzier',
            'email' => 'dedi@podcast.com',
            'no_telp' => '086789012345',
            'instansi' => 'Podcast Inc',
        ]);

        $tamuJanjiTemu6 = Tamu::create([
            'nama' => 'Rina Nose',
            'email' => 'rina.nose@email.com',
            'no_telp' => '087890123456',
            'instansi' => 'Umum',
        ]);

        // ===== KUNJUNGAN JANJI TEMU =====

        // Janji Temu 1: Sedang di dalam ruangan (disetujui, sudah checkin, belum checkout)
        Kunjungan::create([
            'id_tamu' => $tamuJanjiTemu1->id,
            'keperluan' => "Bertemu dengan: Staff IT Support\n\nTopik Diskusi:\nReset Password SSO dan Email",
            'waktu_janji_temu' => $today->copy()->setTime(9, 15),
            'waktu_checkin' => $today->copy()->setTime(9, 20),
            'waktu_checkout' => null,
            'status' => 'disetujui',
        ]);

        // Janji Temu 2: Selesai (sudah checkout)
        Kunjungan::create([
            'id_tamu' => $tamuJanjiTemu2->id,
            'keperluan' => "Bertemu dengan: Staff Administrasi\n\nTopik Diskusi:\nLayanan Email Mahasiswa",
            'waktu_janji_temu' => $today->copy()->setTime(8, 45),
            'waktu_checkin' => $today->copy()->setTime(8, 50),
            'waktu_checkout' => $today->copy()->setTime(9, 30),
            'status' => 'selesai',
        ]);

        // Janji Temu 3: Menunggu persetujuan
        Kunjungan::create([
            'id_tamu' => $tamuJanjiTemu3->id,
            'keperluan' => "Bertemu dengan: Kepala UPT TIK\n\nTopik Diskusi:\nKunjungan Data Center untuk Maintenance Server",
            'waktu_janji_temu' => $today->copy()->addDay()->setTime(10, 0),
            'waktu_checkin' => null,
            'waktu_checkout' => null,
            'status' => 'menunggu',
        ]);

        // Janji Temu 4: Menunggu persetujuan
        Kunjungan::create([
            'id_tamu' => $tamuJanjiTemu4->id,
            'keperluan' => "Bertemu dengan: Staff Jaringan\n\nTopik Diskusi:\nKonsultasi Jaringan untuk Skripsi",
            'waktu_janji_temu' => $today->copy()->addDays(2)->setTime(14, 0),
            'waktu_checkin' => null,
            'waktu_checkout' => null,
            'status' => 'menunggu',
        ]);

        // Janji Temu 5: Riwayat (5 hari lalu, selesai)
        Kunjungan::create([
            'id_tamu' => $tamuJanjiTemu5->id,
            'keperluan' => "Bertemu dengan: Kepala UPA\n\nTopik Diskusi:\nKerjasama Media",
            'waktu_janji_temu' => $today->copy()->subDays(5)->setTime(13, 0),
            'waktu_checkin' => $today->copy()->subDays(5)->setTime(13, 5),
            'waktu_checkout' => $today->copy()->subDays(5)->setTime(14, 15),
            'status' => 'selesai',
        ]);

        // Janji Temu 6: Riwayat (3 hari lalu, selesai)
        Kunjungan::create([
            'id_tamu' => $tamuJanjiTemu6->id,
            'keperluan' => "Bertemu dengan: Staff Multimedia\n\nTopik Diskusi:\nKonsultasi Website",
            'waktu_janji_temu' => $today->copy()->subDays(3)->setTime(9, 0),
            'waktu_checkin' => $today->copy()->subDays(3)->setTime(9, 10),
            'waktu_checkout' => $today->copy()->subDays(3)->setTime(10, 30),
            'status' => 'selesai',
        ]);

        // ===== TAMU UNTUK PEMINJAMAN =====

        $tamuPeminjaman1 = Tamu::create([
            'nama' => 'Himpunan Mahasiswa Elektro',
            'email' => 'hme@student.unila.ac.id',
            'no_telp' => '085678901234',
            'instansi' => 'Organisasi Mahasiswa',
        ]);

        $tamuPeminjaman2 = Tamu::create([
            'nama' => 'BEM Fakultas Teknik',
            'email' => 'bem.ft@student.unila.ac.id',
            'no_telp' => '081122334455',
            'instansi' => 'Organisasi Mahasiswa',
        ]);

        $tamuPeminjaman3 = Tamu::create([
            'nama' => 'UKM Robotika',
            'email' => 'ukm.robotika@student.unila.ac.id',
            'no_telp' => '082233445566',
            'instansi' => 'Unit Kegiatan Mahasiswa',
        ]);

        $tamuPeminjaman4 = Tamu::create([
            'nama' => 'Laboratorium Komputer FMIPA',
            'email' => 'labkom.fmipa@unila.ac.id',
            'no_telp' => '083344556677',
            'instansi' => 'Fakultas MIPA',
        ]);

        $tamuPeminjaman5 = Tamu::create([
            'nama' => 'Himpunan Mahasiswa Informatika',
            'email' => 'hmif@student.unila.ac.id',
            'no_telp' => '084455667788',
            'instansi' => 'Organisasi Mahasiswa',
        ]);

        // ===== KUNJUNGAN & PEMINJAMAN =====

        // Peminjaman 1: Status DIAJUKAN (Menunggu persetujuan)
        $kunjunganPeminjaman1 = Kunjungan::create([
            'id_tamu' => $tamuPeminjaman1->id,
            'keperluan' => 'Peminjaman Fasilitas',
            'waktu_janji_temu' => $today->copy()->addDays(3)->setTime(8, 0),
            'waktu_checkout' => $today->copy()->addDays(3)->setTime(17, 0),
            'waktu_checkin' => null,
            'status' => 'menunggu',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjunganPeminjaman1->id,
            'judul_permohonan' => 'Ruang Server',
            'detail_kebutuhan' => 'Pelatihan Mikrotik untuk anggota HME',
            'status' => 'diajukan',
        ]);

        // Peminjaman 2: Status DIAJUKAN (Menunggu persetujuan)
        $kunjunganPeminjaman2 = Kunjungan::create([
            'id_tamu' => $tamuPeminjaman2->id,
            'keperluan' => 'Peminjaman Fasilitas',
            'waktu_janji_temu' => $today->copy()->addDays(5)->setTime(9, 0),
            'waktu_checkout' => $today->copy()->addDays(5)->setTime(16, 0),
            'waktu_checkin' => null,
            'status' => 'menunggu',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjunganPeminjaman2->id,
            'judul_permohonan' => 'Proyektor & Sound System',
            'detail_kebutuhan' => 'Seminar Nasional Teknologi Informasi',
            'status' => 'diajukan',
        ]);

        // Peminjaman 3: Status DISETUJUI (Sudah disetujui, belum dipinjam)
        $kunjunganPeminjaman3 = Kunjungan::create([
            'id_tamu' => $tamuPeminjaman3->id,
            'keperluan' => 'Peminjaman Fasilitas',
            'waktu_janji_temu' => $today->copy()->addDays(1)->setTime(8, 0),
            'waktu_checkout' => $today->copy()->addDays(1)->setTime(17, 0),
            'waktu_checkin' => null,
            'status' => 'disetujui',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjunganPeminjaman3->id,
            'judul_permohonan' => 'Ruang Lab Komputer',
            'detail_kebutuhan' => 'Workshop IoT dan Arduino untuk anggota UKM',
            'status' => 'disetujui',
        ]);

        // Peminjaman 4: Status DIPINJAM (Sedang berlangsung)
        $kunjunganPeminjaman4 = Kunjungan::create([
            'id_tamu' => $tamuPeminjaman4->id,
            'keperluan' => 'Peminjaman Fasilitas',
            'waktu_janji_temu' => $today->copy()->setTime(8, 0),
            'waktu_checkout' => $today->copy()->setTime(17, 0),
            'waktu_checkin' => $today->copy()->setTime(8, 15),
            'status' => 'disetujui',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjunganPeminjaman4->id,
            'judul_permohonan' => 'Kabel LAN & Switch Hub',
            'detail_kebutuhan' => 'Perbaikan jaringan laboratorium komputer FMIPA',
            'status' => 'dipinjam',
        ]);

        // Peminjaman 5: Status SELESAI (Sudah dikembalikan)
        $kunjunganPeminjaman5 = Kunjungan::create([
            'id_tamu' => $tamuPeminjaman5->id,
            'keperluan' => 'Peminjaman Fasilitas',
            'waktu_janji_temu' => $today->copy()->subDays(2)->setTime(9, 0),
            'waktu_checkout' => $today->copy()->subDays(2)->setTime(15, 0),
            'waktu_checkin' => $today->copy()->subDays(2)->setTime(9, 10),
            'status' => 'selesai',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjunganPeminjaman5->id,
            'judul_permohonan' => 'Ruang Rapat & LCD',
            'detail_kebutuhan' => 'Rapat koordinasi pengurus HMIF periode baru',
            'status' => 'selesai',
        ]);

        // Peminjaman 6: Status DITOLAK
        $tamuPeminjaman6 = Tamu::create([
            'nama' => 'Komunitas Gaming Lampung',
            'email' => 'gaming.lampung@gmail.com',
            'no_telp' => '085566778899',
            'instansi' => 'Komunitas Umum',
        ]);

        $kunjunganPeminjaman6 = Kunjungan::create([
            'id_tamu' => $tamuPeminjaman6->id,
            'keperluan' => 'Peminjaman Fasilitas',
            'waktu_janji_temu' => $today->copy()->subDays(7)->setTime(10, 0),
            'waktu_checkout' => $today->copy()->subDays(7)->setTime(22, 0),
            'waktu_checkin' => null,
            'status' => 'ditolak',
        ]);

        Peminjaman::create([
            'id_kunjungan' => $kunjunganPeminjaman6->id,
            'judul_permohonan' => 'Seluruh Lab Komputer',
            'detail_kebutuhan' => 'Turnamen e-sports selama 12 jam',
            'status' => 'ditolak',
        ]);

        $this->command->info('✅ Seeder completed!');
        $this->command->info('   - 6 Janji Temu (2 menunggu, 1 disetujui, 3 selesai)');
        $this->command->info('   - 6 Peminjaman (2 diajukan, 1 disetujui, 1 dipinjam, 1 selesai, 1 ditolak)');
    }
}
