import { Users, Clock, UserCheck, FileWarning, CheckCircle } from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard() {
    // Data statistik (dummy data untuk UI)
    const stats = [
        {
            title: 'Total Tamu (Bulanan)',
            value: '1,240',
            icon: Users,
            bgColor: 'bg-white',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Rata-rata Harian',
            value: '45',
            icon: Clock,
            bgColor: 'bg-white',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Total Staff Aktif',
            value: '12',
            icon: UserCheck,
            bgColor: 'bg-white',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Peminjaman Pending',
            value: '3',
            icon: FileWarning,
            bgColor: 'bg-white',
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
        },
    ];

    // Data buku tamu harian (dummy data untuk UI)
    const bukuTamuHarian = [
        {
            no: 1,
            nama: 'Ahmad Dahlan',
            keperluan: 'Konsultasi Jaringan',
            instansi: 'Fakultas Hukum',
            waktuMasuk: '09:15',
            waktuKeluar: '10:45',
            durasi: '1j 30m',
            status: 'Selesai',
            petugas: 'Staff A',
        },
        {
            no: 2,
            nama: 'Siti Aminah',
            keperluan: 'Reset Password SSO',
            instansi: 'Mahasiswa FEB',
            waktuMasuk: '10:30',
            waktuKeluar: '-',
            durasi: null,
            status: 'Di Ruangan',
            petugas: 'Staff B',
        },
        {
            no: 3,
            nama: 'Budi Santoso',
            keperluan: 'Layanan Server',
            instansi: 'PT. Telkom Indonesia',
            waktuMasuk: '11:00',
            waktuKeluar: '12:00',
            durasi: '1j 00m',
            status: 'Selesai',
            petugas: 'Staff A',
        },
        {
            no: 4,
            nama: 'Prof. Dr. Irwan',
            keperluan: 'Rapat Pimpinan',
            instansi: 'Rektorat',
            waktuMasuk: '08:00',
            waktuKeluar: '-',
            durasi: null,
            status: 'Di Ruangan',
            statusNote: 'Belum Checkout',
            petugas: 'Kepala UPA',
        },
    ];

    // Format tanggal hari ini
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Administrator</h1>
                <p className="text-slate-500 text-sm mt-1">Ringkasan performa layanan tamu UPA TIK.</p>
            </div>

            {/* System Status Banner */}
            <div className="bg-[#0ea5e9] rounded-xl px-6 py-4 mb-6 flex items-center gap-3">
                <CheckCircle className="text-white" size={20} />
                <span className="text-white font-medium text-sm">
                    <strong>Sistem Normal:</strong> Semua layanan server dan database berjalan optimal hari ini.
                </span>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-100`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-xs font-medium mb-2">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-full`}>
                                    <Icon className={stat.iconColor} size={20} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Buku Tamu Harian Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-800">Buku Tamu Harian</h2>
                        <span className="text-slate-400 text-sm">({formattedDate})</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        Lihat Semua Data
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">No</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Pengunjung</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Instansi</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu Masuk</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu Keluar</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Petugas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bukuTamuHarian.map((tamu) => (
                                <tr key={tamu.no} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">{tamu.no}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{tamu.nama}</p>
                                            <p className="text-xs text-slate-400">{tamu.keperluan}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{tamu.instansi}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{tamu.waktuMasuk}</td>
                                    <td className="px-6 py-4">
                                        {tamu.waktuKeluar !== '-' ? (
                                            <div>
                                                <p className="text-sm text-slate-600">{tamu.waktuKeluar}</p>
                                                {tamu.durasi && (
                                                    <p className="text-xs text-slate-400">Durasi: {tamu.durasi}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm text-slate-400">-</p>
                                                {tamu.statusNote && (
                                                    <p className="text-xs text-red-400">{tamu.statusNote}</p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                tamu.status === 'Selesai'
                                                    ? 'bg-slate-100 text-slate-600'
                                                    : 'bg-emerald-100 text-emerald-700'
                                            }`}
                                        >
                                            {tamu.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{tamu.petugas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
