import { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import StaffLayout from '../../Layouts/StaffLayout';

export default function Dashboard() {
    // Data statistik (dummy data untuk UI)
    const stats = [
        {
            title: 'Total Tamu Hari Ini',
            value: '24',
        },
        {
            title: 'Sedang Di Ruangan',
            value: '5',
        },
        {
            title: 'Permohonan Baru',
            value: '2',
        },
    ];

    // Data aktivitas terkini (dummy data untuk UI)
    const [aktivitasTerkini] = useState([
        {
            id: 1,
            waktu: '09:15',
            nama: 'Ahmad Dahlan',
            instansi: 'Fakultas Hukum',
            keperluan: 'Reset SSO',
            status: 'Di Dalam',
        },
        {
            id: 2,
            waktu: '08:45',
            nama: 'Siti Aminah',
            instansi: 'Mahasiswa FEB',
            keperluan: 'Layanan Email',
            status: 'Selesai',
        },
        {
            id: 3,
            waktu: '08:30',
            nama: 'PT. Telkom',
            instansi: 'Vendor',
            keperluan: 'Kunjungan Data Center',
            status: 'Selesai',
        },
    ]);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const handleExportExcel = () => {
        // Untuk UI saja
        console.log('Export Excel clicked');
        alert('Fitur Export Excel (UI Only)');
    };

    return (
        <StaffLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">{getGreeting()}, Staff TIK</h1>
                <p className="text-slate-500 text-sm mt-0.5">Monitoring aktivitas kunjungan hari ini.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg p-5 border border-gray-100"
                    >
                        <p className="text-slate-500 text-xs font-medium mb-2">{stat.title}</p>
                        <p className="text-3xl font-bold text-[#0ea5e9]">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Aktivitas Terkini Table */}
            <div className="bg-white rounded-lg border border-gray-100">
                {/* Table Header */}
                <div className="px-5 py-4 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-base font-bold text-slate-800">Aktivitas Terkini</h2>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-md font-medium text-xs transition-colors"
                    >
                        <FileSpreadsheet size={14} />
                        Export Excel
                    </button>
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
                            {aktivitasTerkini.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.waktu}</td>
                                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{item.nama}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.instansi}</td>
                                    <td className="px-5 py-3 text-sm text-slate-600">{item.keperluan}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
                                                item.status === 'Di Dalam'
                                                    ? 'bg-[#0ea5e9] text-white'
                                                    : 'bg-[#f59e0b] text-white'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        {item.status === 'Di Dalam' ? (
                                            <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
                                                Check Out
                                            </button>
                                        ) : (
                                            <button className="bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
                                                Detail
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </StaffLayout>
    );
}
