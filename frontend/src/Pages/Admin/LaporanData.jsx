import { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';
import AdminLayout from '../../Layouts/AdminLayout';

export default function LaporanData() {
    // State untuk filter
    const [filters, setFilters] = useState({
        dariTanggal: '',
        sampaiTanggal: '',
        kategori: 'Semua Data',
    });

    // State untuk data dari API
    const [dataPreview, setDataPreview] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        fetchDataPreview();
    }, []);

    const fetchDataPreview = async (appliedFilters = null, page = 1) => {
        setLoading(true);
        try {
            const currentFilters = appliedFilters || filters;
            const params = { 
                per_page: perPage,
                page: page 
            };
            
            // Add filter params
            if (currentFilters.dariTanggal) params.start_date = currentFilters.dariTanggal;
            if (currentFilters.sampaiTanggal) params.end_date = currentFilters.sampaiTanggal;
            
            const response = await api.get('/admin/dashboard/kunjungan', { params });
            
            // Transform and filter data
            let transformedData = response.data.data.map((item) => ({
                id: item.id,
                tanggal: new Date(item.create_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }),
                nama: item.tamu?.nama || '-',
                keperluan: item.peminjaman ? 'Peminjaman' : 'Janji Temu',
                status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                hasPeminjaman: !!item.peminjaman,
            }));

            // Filter by kategori on client side
            if (currentFilters.kategori === 'Janji Temu') {
                transformedData = transformedData.filter(item => !item.hasPeminjaman);
            } else if (currentFilters.kategori === 'Peminjaman') {
                transformedData = transformedData.filter(item => item.hasPeminjaman);
            }
            
            setDataPreview(transformedData);
            setTotalData(response.data.total || 0);
            setCurrentPage(response.data.current_page || 1);
            setLastPage(response.data.last_page || 1);
        } catch (error) {
            console.error('Error fetching data preview:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle apply filter
    const handleApplyFilter = () => {
        setCurrentPage(1);
        fetchDataPreview(filters, 1);
    };

    // Handle reset filter
    const handleResetFilter = () => {
        const resetFilters = {
            dariTanggal: '',
            sampaiTanggal: '',
            kategori: 'Semua Data',
        };
        setFilters(resetFilters);
        setCurrentPage(1);
        fetchDataPreview(resetFilters, 1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        setCurrentPage(page);
        fetchDataPreview(filters, page);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (lastPage <= maxVisiblePages) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(lastPage);
            }
        }
        
        return pages;
    };

    // Fetch export data from API
    const fetchExportData = async () => {
        const params = {};
        if (filters.dariTanggal) params.start_date = filters.dariTanggal;
        if (filters.sampaiTanggal) params.end_date = filters.sampaiTanggal;
        if (filters.kategori !== 'Semua Data') params.kategori = filters.kategori;

        const response = await api.get('/staff/export/excel', { params });
        return response.data;
    };

    // Generate CSV content and download as Excel-compatible file
    const handleDownloadExcel = async () => {
        setDownloadingExcel(true);
        try {
            const result = await fetchExportData();
            
            if (!result.data || result.data.length === 0) {
                alert('Tidak ada data untuk diunduh');
                return;
            }

            // Create CSV content
            const headers = ['Tanggal', 'Waktu', 'Nama', 'Email', 'No. Telp', 'Instansi', 'Jenis', 'Keperluan', 'Status', 'Check-in', 'Check-out'];
            const csvRows = [headers.join(',')];

            result.data.forEach(row => {
                const values = [
                    `"${row.tanggal}"`,
                    `"${row.waktu}"`,
                    `"${row.nama}"`,
                    `"${row.email}"`,
                    `"${row.no_telp}"`,
                    `"${row.instansi}"`,
                    `"${row.jenis}"`,
                    `"${row.keperluan}"`,
                    `"${row.status}"`,
                    `"${row.waktu_checkin}"`,
                    `"${row.waktu_checkout}"`,
                ];
                csvRows.push(values.join(','));
            });

            const csvContent = '\uFEFF' + csvRows.join('\n'); // BOM for UTF-8
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${result.filename}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel:', error);
            alert('Gagal mengunduh file. Silakan coba lagi.');
        } finally {
            setDownloadingExcel(false);
        }
    };

    // Generate PDF and download
    const handleDownloadPDF = async () => {
        setDownloadingPdf(true);
        try {
            const result = await fetchExportData();
            
            if (!result.data || result.data.length === 0) {
                alert('Tidak ada data untuk diunduh');
                return;
            }

            // Create printable HTML content
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Laporan Kunjungan - DigiTamu TIK</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #1e293b; margin-bottom: 5px; }
                        .subtitle { text-align: center; color: #64748b; margin-bottom: 20px; }
                        .info { margin-bottom: 15px; font-size: 12px; color: #475569; }
                        table { width: 100%; border-collapse: collapse; font-size: 11px; }
                        th { background-color: #0ea5e9; color: white; padding: 10px 8px; text-align: left; }
                        td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
                        tr:nth-child(even) { background-color: #f8fafc; }
                        .status-selesai { color: #059669; font-weight: bold; }
                        .status-menunggu { color: #d97706; font-weight: bold; }
                        .status-disetujui { color: #2563eb; font-weight: bold; }
                        .status-ditolak { color: #dc2626; font-weight: bold; }
                        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94a3b8; }
                        @media print {
                            body { padding: 0; }
                            @page { margin: 1cm; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Laporan Kunjungan Tamu</h1>
                    <p class="subtitle">UPA TIK Universitas Lampung</p>
                    <div class="info">
                        <strong>Periode:</strong> ${filters.dariTanggal || 'Semua'} s/d ${filters.sampaiTanggal || 'Semua'} | 
                        <strong>Kategori:</strong> ${filters.kategori} | 
                        <strong>Total Data:</strong> ${result.total} record
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Nama</th>
                                <th>Instansi</th>
                                <th>Jenis</th>
                                <th>Keperluan</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.data.map((row, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${row.tanggal}</td>
                                    <td>${row.nama}</td>
                                    <td>${row.instansi}</td>
                                    <td>${row.jenis}</td>
                                    <td>${row.keperluan}</td>
                                    <td class="status-${row.status.toLowerCase()}">${row.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        Dicetak pada: ${new Date().toLocaleString('id-ID')} | DigiTamu TIK - UPA TIK Universitas Lampung
                    </div>
                </body>
                </html>
            `;

            // Open print dialog
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            
            // Wait for content to load then print
            setTimeout(() => {
                printWindow.print();
            }, 250);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Gagal membuat PDF. Silakan coba lagi.');
        } finally {
            setDownloadingPdf(false);
        }
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Pusat Laporan & Ekspor Data</h1>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-base font-bold text-slate-800 mb-4">Filter Laporan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Dari Tanggal */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                            Dari Tanggal
                        </label>
                        <input
                            type="date"
                            name="dariTanggal"
                            value={filters.dariTanggal}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                        />
                    </div>

                    {/* Sampai Tanggal */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                            Sampai Tanggal
                        </label>
                        <input
                            type="date"
                            name="sampaiTanggal"
                            value={filters.sampaiTanggal}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                        />
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                            Kategori
                        </label>
                        <select
                            name="kategori"
                            value={filters.kategori}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm bg-white"
                        >
                            <option value="Semua Data">Semua Data</option>
                            <option value="Janji Temu">Janji Temu</option>
                            <option value="Peminjaman">Peminjaman</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    {/* Filter Buttons */}
                    <button
                        onClick={handleApplyFilter}
                        disabled={loading}
                        className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        <Search size={18} />
                        Terapkan Filter
                    </button>
                    <button
                        onClick={handleResetFilter}
                        disabled={loading}
                        className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        Reset
                    </button>
                    
                    <div className="flex-1"></div>
                    
                    {/* Download Buttons */}
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloadingPdf}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {downloadingPdf ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <FileText size={18} />
                        )}
                        {downloadingPdf ? 'Memproses...' : 'Download PDF'}
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        disabled={downloadingExcel}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {downloadingExcel ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <FileSpreadsheet size={18} />
                        )}
                        {downloadingExcel ? 'Mengunduh...' : 'Download Excel'}
                    </button>
                </div>
            </div>

            {/* Data Preview Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">
                            Pratinjau Data
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {filters.kategori !== 'Semua Data' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-sky-100 text-sky-700 mr-2">
                                    {filters.kategori}
                                </span>
                            )}
                            {filters.dariTanggal && filters.sampaiTanggal && (
                                <span className="text-slate-400">
                                    {filters.dariTanggal} s/d {filters.sampaiTanggal}
                                </span>
                            )}
                            {!filters.dariTanggal && !filters.sampaiTanggal && filters.kategori === 'Semua Data' && (
                                <span className="text-slate-400">Menampilkan {perPage} data per halaman</span>
                            )}
                        </p>
                    </div>
                    <span className="text-sm text-slate-500">
                        Total: {totalData} data
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Keperluan</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                                            <span className="text-slate-500">Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : dataPreview.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                        Belum ada data kunjungan
                                    </td>
                                </tr>
                            ) : (
                                dataPreview.map((data) => (
                                    <tr key={data.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600">{data.tanggal}</td>
                                        <td className="px-6 py-4 text-sm text-slate-800">{data.nama}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{data.keperluan}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium ${
                                                data.status === 'Selesai' ? 'text-emerald-600' :
                                                data.status === 'Menunggu' ? 'text-yellow-600' :
                                                data.status === 'Disetujui' ? 'text-blue-600' :
                                                data.status === 'Ditolak' ? 'text-red-600' :
                                                'text-slate-600'
                                            }`}>
                                                {data.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && lastPage > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Menampilkan {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, totalData)} dari {totalData} data
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={18} className="text-slate-600" />
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-colors ${
                                            currentPage === page
                                                ? 'bg-sky-500 text-white'
                                                : 'text-slate-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={18} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
