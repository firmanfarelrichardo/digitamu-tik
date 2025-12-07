import { useState, useEffect } from 'react';
import { Users, Clock, UserCheck, FileWarning, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_tamu_bulanan: 0,
        rata_rata_harian: 0,
        total_staff_aktif: 0,
        peminjaman_pending: 0,
    });
    const [bukuTamuHarian, setBukuTamuHarian] = useState([]);
    const [tanggalHariIni, setTanggalHariIni] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch stats and buku tamu in parallel
            const [statsRes, bukuTamuRes] = await Promise.all([
                api.get('/admin/dashboard/stats'),
                api.get('/admin/dashboard/buku-tamu-harian'),
            ]);

            setStats(statsRes.data);
            setBukuTamuHarian(bukuTamuRes.data.data);
            setTanggalHariIni(bukuTamuRes.data.tanggal);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stats cards configuration
    const statsCards = [
        {
            title: 'Total Tamu (Bulanan)',
            value: stats.total_tamu_bulanan.toLocaleString('id-ID'),
            icon: Users,
            bgColor: 'bg-white',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Rata-rata Harian',
            value: stats.rata_rata_harian.toLocaleString('id-ID'),
            icon: Clock,
            bgColor: 'bg-white',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Total Staff Aktif',
            value: stats.total_staff_aktif.toLocaleString('id-ID'),
            icon: UserCheck,
            bgColor: 'bg-white',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Peminjaman Pending',
            value: stats.peminjaman_pending.toLocaleString('id-ID'),
            icon: FileWarning,
            bgColor: 'bg-white',
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
        },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                    <span className="ml-2 text-slate-600">Memuat data...</span>
                </div>
            </AdminLayout>
        );
    }

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
                {statsCards.map((stat, index) => {
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
                        <span className="text-slate-400 text-sm">({tanggalHariIni})</span>
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
                            {bukuTamuHarian.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                                        Belum ada kunjungan hari ini
                                    </td>
                                </tr>
                            ) : (
                                bukuTamuHarian.map((tamu) => (
                                    <tr key={tamu.no} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600">{tamu.no}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{tamu.nama}</p>
                                                <p className="text-xs text-slate-400">{tamu.keperluan}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{tamu.instansi}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{tamu.waktu_masuk}</td>
                                        <td className="px-6 py-4">
                                            {tamu.waktu_keluar ? (
                                                <div>
                                                    <p className="text-sm text-slate-600">{tamu.waktu_keluar}</p>
                                                    {tamu.durasi && (
                                                        <p className="text-xs text-slate-400">Durasi: {tamu.durasi}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-sm text-slate-400">-</p>
                                                    {tamu.belum_checkout && (
                                                        <p className="text-xs text-red-400">Belum Checkout</p>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    tamu.status === 'Selesai'
                                                        ? 'bg-slate-100 text-slate-600'
                                                        : tamu.status === 'Di Ruangan'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : tamu.status === 'Menunggu'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                {tamu.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{tamu.petugas}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
