import { useState } from 'react';
import { Search } from 'lucide-react';
import StaffLayout from '../../Layouts/StaffLayout';

export default function RiwayatTamu() {
    // State untuk filter
    const [filters, setFilters] = useState({
        search: '',
        tanggal: '',
    });

    // Data riwayat kunjungan (dummy data untuk UI)
    const [riwayatList] = useState([
        {
            id: 1,
            tanggal: '20 Nov 2025',
            nama: 'Rina Nose',
            instansi: 'Umum',
            keperluan: 'Konsultasi Website',
            bertemu: 'Pak Budi',
            jamMasuk: '09:00',
            jamKeluar: '10:30',
        },
        {
            id: 2,
            tanggal: '19 Nov 2025',
            nama: 'Dedi Corbuzier',
            instansi: 'Podcast Inc',
            keperluan: 'Kerjasama',
            bertemu: 'Kepala UPA',
            jamMasuk: '13:00',
            jamKeluar: '14:15',
        },
    ]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCariData = () => {
        // Untuk UI saja
        console.log('Cari Data clicked with filters:', filters);
        alert('Fitur Cari Data (UI Only)');
    };

    return (
        <StaffLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Data Riwayat Kunjungan</h1>
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
                            </tr>
                        </thead>
                        <tbody>
                            {riwayatList.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.tanggal}</td>
                                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.instansi}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.keperluan}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.bertemu}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.jamMasuk}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.jamKeluar}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {riwayatList.length === 0 && (
                    <div className="p-10 text-center">
                        <p className="text-slate-500 text-sm">Tidak ada data riwayat kunjungan.</p>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
