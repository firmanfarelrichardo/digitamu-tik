import { useState } from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function LaporanData() {
    // State untuk filter
    const [filters, setFilters] = useState({
        dariTanggal: '',
        sampaiTanggal: '',
        kategori: 'Semua Data',
    });

    // Data pratinjau (dummy data untuk UI)
    const [dataPreview] = useState([
        {
            id: 1,
            tanggal: '24 Nov 2025',
            nama: 'Budi Santoso',
            keperluan: 'Konsultasi',
            status: 'Selesai',
        },
        {
            id: 2,
            tanggal: '23 Nov 2025',
            nama: 'Dinas Pendidikan',
            keperluan: 'Studi Banding',
            status: 'Selesai',
        },
    ]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDownloadPDF = () => {
        // Untuk UI saja
        console.log('Download PDF clicked');
        alert('Fitur Download PDF (UI Only)');
    };

    const handleDownloadExcel = () => {
        // Untuk UI saja
        console.log('Download Excel clicked');
        alert('Fitur Download Excel (UI Only)');
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
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm bg-slate-700 text-white"
                        >
                            <option value="Semua Data">Semua Data</option>
                            <option value="Janji Temu">Janji Temu</option>
                            <option value="Peminjaman">Peminjaman</option>
                            <option value="Kunjungan Langsung">Kunjungan Langsung</option>
                        </select>
                    </div>
                </div>

                {/* Download Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                    >
                        <FileText size={18} />
                        Download PDF
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                    >
                        <FileSpreadsheet size={18} />
                        Download Excel
                    </button>
                </div>
            </div>

            {/* Data Preview Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-slate-800">
                        Pratinjau Data (5 Transaksi Terakhir)
                    </h2>
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
                            {dataPreview.map((data) => (
                                <tr key={data.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">{data.tanggal}</td>
                                    <td className="px-6 py-4 text-sm text-slate-800">{data.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{data.keperluan}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-600 text-sm font-medium">
                                            {data.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
