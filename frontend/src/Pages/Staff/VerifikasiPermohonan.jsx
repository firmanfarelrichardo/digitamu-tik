import { useState } from 'react';
import { Calendar, MapPin, FileText } from 'lucide-react';
import StaffLayout from '../../Layouts/StaffLayout';

export default function VerifikasiPermohonan() {
    // Data permohonan masuk (dummy data untuk UI)
    const [permohonanList] = useState([
        {
            id: 1,
            nama: 'Budi Santoso (Mahasiswa)',
            deskripsi: 'Ingin melakukan konsultasi jaringan untuk Skripsi dengan Pak Andi.',
            tanggal: '25 Nov 2025, 10:00 WIB',
            lokasi: 'Divisi Jaringan',
            type: 'janji-temu',
        },
        {
            id: 2,
            nama: 'Himpunan Mahasiswa Elektro',
            deskripsi: 'Peminjaman Ruang Server untuk pelatihan mikrotik.',
            tanggal: '26 Nov 2025, 08:00 WIB',
            lampiran: 'Ada Lampiran Surat',
            type: 'peminjaman',
        },
    ]);

    const handleTolak = (id) => {
        // Untuk UI saja
        console.log('Tolak clicked for id:', id);
        alert('Fitur Tolak (UI Only)');
    };

    const handleSetujui = (id) => {
        // Untuk UI saja
        console.log('Setujui clicked for id:', id);
        alert('Fitur Setujui (UI Only)');
    };

    return (
        <StaffLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Daftar Permohonan Masuk</h1>
                <p className="text-slate-500 text-sm mt-0.5">Persetujuan janji temu dan peminjaman fasilitas.</p>
            </div>

            {/* Permohonan Cards */}
            <div className="space-y-4">
                {permohonanList.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg border border-gray-100 p-5 border-l-4 border-l-[#f59e0b]"
                    >
                        <div className="flex justify-between items-start">
                            {/* Left Content */}
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-slate-800 mb-1">
                                    {item.nama}
                                </h3>
                                <p className="text-slate-600 text-sm mb-3">
                                    {item.deskripsi}
                                </p>
                                
                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} className="text-[#ef4444]" />
                                        <span>{item.tanggal}</span>
                                    </div>
                                    {item.lokasi && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} className="text-[#ef4444]" />
                                            <span>{item.lokasi}</span>
                                        </div>
                                    )}
                                    {item.lampiran && (
                                        <div className="flex items-center gap-1">
                                            <FileText size={12} className="text-[#ef4444]" />
                                            <span>{item.lampiran}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Action Buttons */}
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => handleTolak(item.id)}
                                    className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2 rounded-md text-xs font-medium transition-colors"
                                >
                                    Tolak
                                </button>
                                <button
                                    onClick={() => handleSetujui(item.id)}
                                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-md text-xs font-medium transition-colors"
                                >
                                    Setujui
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {permohonanList.length === 0 && (
                    <div className="bg-white rounded-lg border border-gray-100 p-10 text-center">
                        <p className="text-slate-500 text-sm">Tidak ada permohonan yang perlu diverifikasi.</p>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
