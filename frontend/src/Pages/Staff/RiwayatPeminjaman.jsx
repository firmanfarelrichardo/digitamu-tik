import { useState, useEffect } from 'react';
import { FileText, X, Eye, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import StaffLayout from '../../Layouts/StaffLayout';

const API_URL = 'http://localhost:8000';

export default function RiwayatPeminjaman() {
    // State untuk filter
    const [filters, setFilters] = useState({
        search: '',
        tanggal: '',
    });

    // State untuk data dari API
    const [riwayatList, setRiwayatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // State untuk modal detail
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fungsi untuk truncate text menjadi maksimal 3 kata
    const truncateWords = (text, maxWords = 3) => {
        if (!text) return '-';
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + ' ...';
    };

    // Fetch riwayat data
    const fetchRiwayat = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/staff/riwayat-peminjaman`, { params });
            if (response.data.success) {
                setRiwayatList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching riwayat peminjaman:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiwayat();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCariData = () => {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.tanggal) params.tanggal = filters.tanggal;
        
        fetchRiwayat(params);
    };

    // Handle enter key press on search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCariData();
        }
    };

    // Handle pinjam barang (Menunggu -> Dipinjam)
    const handlePinjam = async (id) => {
        if (actionLoading) return;
        
        setActionLoading(id);
        try {
            const response = await axios.post(`${API_URL}/staff/peminjaman/${id}/pinjam`);
            if (response.data.success) {
                fetchRiwayat();
            }
        } catch (error) {
            console.error('Error pinjam:', error);
            alert('Gagal mengubah status. Silakan coba lagi.');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle selesai peminjaman (Dipinjam -> Selesai)
    const handleSelesai = async (id) => {
        if (actionLoading) return;
        
        setActionLoading(id);
        try {
            const response = await axios.post(`${API_URL}/staff/peminjaman/${id}/selesai`);
            if (response.data.success) {
                fetchRiwayat();
            }
        } catch (error) {
            console.error('Error selesai:', error);
            alert('Gagal menyelesaikan peminjaman. Silakan coba lagi.');
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

    // Handle export excel
    const handleExportExcel = () => {
        if (riwayatList.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        // Create CSV content
        const headers = ['Nama', 'Instansi', 'Barang/Fasilitas', 'Detail Kebutuhan', 'Status', 'Tanggal Mulai', 'Tanggal Selesai'];
        const csvContent = [
            headers.join(','),
            ...riwayatList.map(row => [
                `"${row.nama}"`,
                `"${row.instansi}"`,
                `"${row.judulPermohonan?.replace(/"/g, '""') || '-'}"`,
                `"${row.detailKebutuhan?.replace(/"/g, '""') || '-'}"`,
                row.status || '-',
                row.tanggalMulai || '-',
                row.tanggalSelesai || '-',
            ].join(','))
        ].join('\n');

        // Download file
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const today = new Date().toISOString().split('T')[0];
        link.href = URL.createObjectURL(blob);
        link.download = `riwayat_peminjaman_${today}.csv`;
        link.click();
    };

    return (
        <StaffLayout>
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Data Riwayat Peminjaman</h1>
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                >
                    <FileSpreadsheet size={16} />
                    Export Excel
                </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3 items-end">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Cari nama pemohon atau instansi..."
                                className="w-full pl-4 pr-4 py-2.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] outline-none transition-all text-sm placeholder-slate-400"
                            />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <input
                            type="date"
                            name="tanggal"
                            value={filters.tanggal}
                            onChange={handleFilterChange}
                            className="px-4 py-2.5 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] outline-none transition-all text-sm"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleCariData}
                        className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors"
                    >
                        Cari Data
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Nama</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Instansi</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Judul Permohonan</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Detail Kebutuhan</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Lampiran</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Tanggal Mulai</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Tanggal Selesai</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Status</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : riwayatList.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Tidak ada data riwayat peminjaman.
                                    </td>
                                </tr>
                            ) : (
                                riwayatList.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.instansi}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.judulPermohonan}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600" title={item.detailKebutuhan}>
                                            {truncateWords(item.detailKebutuhan, 3)}
                                        </td>
                                        <td className="px-5 py-3">
                                            {item.hasBerkas ? (
                                                <span className="inline-flex items-center gap-1 text-[#0ea5e9] text-xs">
                                                    <FileText size={12} />
                                                    Ada
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.tanggalMulai}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.tanggalSelesai}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                                                    item.status === 'Menunggu'
                                                        ? 'bg-[#f59e0b] text-white'
                                                        : item.status === 'Dipinjam'
                                                        ? 'bg-[#0ea5e9] text-white'
                                                        : item.status === 'Selesai'
                                                        ? 'bg-[#22c55e] text-white'
                                                        : 'bg-gray-400 text-white'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                {item.status === 'Menunggu' ? (
                                                    <button
                                                        onClick={() => handlePinjam(item.id)}
                                                        disabled={actionLoading === item.id}
                                                        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === item.id ? '...' : 'Dipinjam'}
                                                    </button>
                                                ) : item.status === 'Dipinjam' ? (
                                                    <button
                                                        onClick={() => handleSelesai(item.id)}
                                                        disabled={actionLoading === item.id}
                                                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === item.id ? '...' : 'Selesai'}
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

            {/* Modal Detail Peminjaman */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-slate-800">Detail Peminjaman</h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Info Pemohon */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nama Pemohon</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.nama}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Instansi</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.instansi}</p>
                                </div>
                            </div>

                            {/* Kontak Pemohon */}
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

                            {/* Judul Permohonan */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Judul Permohonan</label>
                                <p className="text-sm text-slate-800 mt-1">{selectedItem.judulPermohonan}</p>
                            </div>

                            {/* Detail Kebutuhan */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Detail Kebutuhan</label>
                                <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                                    {selectedItem.detailKebutuhan || '-'}
                                </p>
                            </div>

                            {/* Tanggal */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal Mulai</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.tanggalMulai}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal Selesai</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.tanggalSelesai}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                                            selectedItem.status === 'Menunggu'
                                                ? 'bg-[#f59e0b] text-white'
                                                : selectedItem.status === 'Dipinjam'
                                                ? 'bg-[#0ea5e9] text-white'
                                                : selectedItem.status === 'Selesai'
                                                ? 'bg-[#22c55e] text-white'
                                                : 'bg-gray-400 text-white'
                                        }`}
                                    >
                                        {selectedItem.status}
                                    </span>
                                </div>
                            </div>

                            {/* Lampiran / Surat */}
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lampiran Surat</label>
                                <div className="mt-2">
                                    {selectedItem.hasBerkas && selectedItem.berkasUrl ? (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Preview jika PDF atau gambar */}
                                            {selectedItem.berkasUrl.toLowerCase().endsWith('.pdf') ? (
                                                <iframe
                                                    src={selectedItem.berkasUrl}
                                                    className="w-full h-96"
                                                    title="Preview Surat"
                                                />
                                            ) : (
                                                <img
                                                    src={selectedItem.berkasUrl}
                                                    alt="Lampiran Surat"
                                                    className="w-full max-h-96 object-contain bg-gray-100"
                                                />
                                            )}
                                            <div className="p-3 bg-gray-50 border-t border-gray-200">
                                                <a
                                                    href={selectedItem.berkasUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-[#0ea5e9] hover:text-[#0284c7] text-sm font-medium"
                                                >
                                                    <FileText size={16} />
                                                    Buka di Tab Baru
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-500 bg-gray-50 p-4 rounded-md text-center">
                                            Tidak ada lampiran surat
                                        </div>
                                    )}
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
