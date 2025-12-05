import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import axios from 'axios';
import StaffLayout from '../../Layouts/StaffLayout';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
    // State untuk data dari API
    const [stats, setStats] = useState({
        totalTamuHariIni: 0,
        sedangDiRuangan: 0,
        permohonanBaru: 0,
    });
    const [aktivitasTerkini, setAktivitasTerkini] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // State untuk modal detail
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch dashboard data
    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`${API_URL}/staff/dashboard`);
            if (response.data.success) {
                setStats(response.data.data.stats);
                setAktivitasTerkini(response.data.data.aktivitasTerkini);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        
        // Auto refresh every 30 seconds
        const interval = setInterval(fetchDashboard, 30000);
        return () => clearInterval(interval);
    }, []);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    // Handle checkin
    const handleCheckin = async (id) => {
        if (actionLoading) return;
        
        setActionLoading(id);
        try {
            const response = await axios.post(`${API_URL}/staff/kunjungan/${id}/checkin`);
            if (response.data.success) {
                // Refresh data after checkin
                fetchDashboard();
            }
        } catch (error) {
            console.error('Error checkin:', error);
            alert('Gagal melakukan check-in. Silakan coba lagi.');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle checkout
    const handleCheckout = async (id) => {
        if (actionLoading) return;
        
        setActionLoading(id);
        try {
            const response = await axios.post(`${API_URL}/staff/kunjungan/${id}/checkout`);
            if (response.data.success) {
                // Refresh data after checkout
                fetchDashboard();
            }
        } catch (error) {
            console.error('Error checkout:', error);
            alert('Gagal melakukan checkout. Silakan coba lagi.');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle buka modal detail
    const handleOpenDetail = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // Handle tutup modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    // Truncate keperluan to 3 words
    const truncateWords = (text, maxWords = 3) => {
        if (!text) return '-';
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + ' ...';
    };

    // Statistics display data
    const statsDisplay = [
        {
            title: 'Total Tamu Hari Ini',
            value: stats.totalTamuHariIni.toString(),
        },
        {
            title: 'Sedang Di Ruangan',
            value: stats.sedangDiRuangan.toString(),
        },
        {
            title: 'Permohonan Baru',
            value: stats.permohonanBaru.toString(),
        },
    ];

    return (
        <StaffLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">{getGreeting()}, Staff TIK</h1>
                <p className="text-slate-500 text-sm mt-0.5">Monitoring aktivitas kunjungan hari ini.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {statsDisplay.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg p-5 border border-gray-100"
                    >
                        <p className="text-slate-500 text-xs font-medium mb-2">{stat.title}</p>
                        <p className="text-3xl font-bold text-[#0ea5e9]">
                            {loading ? '...' : stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Aktivitas Terkini Table */}
            <div className="bg-white rounded-lg border border-gray-100">
                {/* Table Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-slate-800">Aktivitas Terkini</h2>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Waktu</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Nama Pengunjung</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Instansi</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Keperluan</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Status</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : aktivitasTerkini.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Belum ada aktivitas hari ini.
                                    </td>
                                </tr>
                            ) : (
                                aktivitasTerkini.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.waktu}</td>
                                        <td className="px-5 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.instansi}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 max-w-[200px]" title={item.keperluanFull || item.keperluan}>
                                            <span className="block truncate">
                                                {truncateWords(item.keperluan, 3)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                                                    item.status === 'Di Dalam'
                                                        ? 'bg-[#0ea5e9] text-white'
                                                        : item.status === 'Selesai'
                                                        ? 'bg-[#22c55e] text-white'
                                                        : item.status === 'Menunggu'
                                                        ? 'bg-[#f59e0b] text-white'
                                                        : 'bg-red-500 text-white'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                {item.status === 'Menunggu' ? (
                                                    <button
                                                        onClick={() => handleCheckin(item.id)}
                                                        disabled={actionLoading === item.id}
                                                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === item.id ? '...' : 'Check In'}
                                                    </button>
                                                ) : item.status === 'Di Dalam' ? (
                                                    <button
                                                        onClick={() => handleCheckout(item.id)}
                                                        disabled={actionLoading === item.id}
                                                        className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === item.id ? '...' : 'Check Out'}
                                                    </button>
                                                ) : null}
                                                <button 
                                                    onClick={() => handleOpenDetail(item)}
                                                    className="bg-slate-500 hover:bg-slate-600 text-white p-1.5 rounded text-xs font-medium transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail Kunjungan */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-slate-800">Detail Kunjungan</h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Info Tamu */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nama Tamu</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.nama}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Instansi</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.instansi}</p>
                                </div>
                            </div>

                            {/* Kontak */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Telepon</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.noTelp || '-'}</p>
                                </div>
                            </div>

                            {/* Keperluan */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Keperluan</label>
                                <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                                    {selectedItem.keperluanFull || selectedItem.keperluan}
                                </p>
                            </div>

                            {/* Bertemu */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bertemu Dengan</label>
                                <p className="text-sm text-slate-800 mt-1">{selectedItem.bertemu || '-'}</p>
                            </div>

                            {/* Waktu */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Waktu Janji</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.waktu}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jam Masuk</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.jamMasuk || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jam Keluar</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.jamKeluar || '-'}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                                            selectedItem.status === 'Di Dalam'
                                                ? 'bg-[#0ea5e9] text-white'
                                                : selectedItem.status === 'Selesai'
                                                ? 'bg-[#22c55e] text-white'
                                                : selectedItem.status === 'Menunggu'
                                                ? 'bg-[#f59e0b] text-white'
                                                : 'bg-red-500 text-white'
                                        }`}
                                    >
                                        {selectedItem.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
