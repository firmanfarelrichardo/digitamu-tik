import { useState, useEffect } from 'react';
import { Search, Eye, X, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import StaffLayout from '../../Layouts/StaffLayout';

const API_URL = 'http://localhost:8000';

export default function RiwayatTamu() {
    // State untuk filter
    const [filters, setFilters] = useState({
        search: '',
        tanggal: '',
    });

    // State untuk data dari API
    const [riwayatList, setRiwayatList] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk modal detail
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch riwayat data
    const fetchRiwayat = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/staff/riwayat`, { params });
            if (response.data.success) {
                setRiwayatList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching riwayat:', error);
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

    // Handle export excel
    const handleExportExcel = () => {
        if (riwayatList.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        // Create CSV content
        const headers = ['Tanggal', 'Nama', 'Instansi', 'Keperluan', 'Bertemu Dengan', 'Jam Masuk', 'Jam Keluar'];
        const csvContent = [
            headers.join(','),
            ...riwayatList.map(row => [
                row.tanggal,
                `"${row.nama}"`,
                `"${row.instansi}"`,
                `"${row.keperluan?.replace(/"/g, '""') || '-'}"`,
                `"${row.bertemu || '-'}"`,
                row.jamMasuk || '-',
                row.jamKeluar || '-',
            ].join(','))
        ].join('\n');

        // Download file
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const today = new Date().toISOString().split('T')[0];
        link.href = URL.createObjectURL(blob);
        link.download = `riwayat_kunjungan_${today}.csv`;
        link.click();
    };

    return (
        <StaffLayout>
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800">Data Riwayat Kunjungan</h1>
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
                                placeholder="Cari nama tamu atau instansi..."
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
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Tanggal</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Nama</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Instansi</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Keperluan</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Bertemu</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Jam Masuk</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Jam Keluar</th>
                                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : riwayatList.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-5 py-8 text-center text-slate-500 text-sm">
                                        Tidak ada data riwayat kunjungan.
                                    </td>
                                </tr>
                            ) : (
                                riwayatList.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.tanggal}</td>
                                        <td className="px-5 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.instansi}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600 max-w-[200px]" title={item.keperluan}>
                                            <span className="block truncate">
                                                {truncateWords(item.keperluan, 3)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.bertemu}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.jamMasuk}</td>
                                        <td className="px-5 py-3 text-sm text-slate-600">{item.jamKeluar}</td>
                                        <td className="px-5 py-3">
                                            <button 
                                                onClick={() => handleOpenDetail(item)}
                                                className="bg-slate-500 hover:bg-slate-600 text-white p-1.5 rounded text-xs font-medium transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={14} />
                                            </button>
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
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.tanggal}</p>
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
                                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[#22c55e] text-white">
                                        Selesai
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
