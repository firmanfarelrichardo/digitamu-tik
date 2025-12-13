import { Link } from 'react-router-dom';
import GuestLayout from '../Layouts/GuestLayout';

export default function Welcome() {
    return (
        <GuestLayout>
            {/* Hero Section */}
            <div className="text-center mb-10 px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Selamat Datang di DigiTamu
                </h1>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Platform layanan digital terpadu UPA TIK Universitas Lampung. Silakan pilih layanan yang Anda butuhkan untuk memulai.
                </p>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12 px-4">
                {/* Card 1: Janji Temu Online */}
                <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow border-t-[6px] border-[#00B4D8]">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className="w-14 h-14 bg-[#DBEAFE] rounded-full flex items-center justify-center mb-5">
                            <svg className="w-7 h-7 text-[#00B4D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-900 mb-3">
                            Janji Temu
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-600 mb-6 text-xs leading-relaxed">
                            Jadwalkan pertemuan dengan staff atau administrasi UPA TIK.
                        </p>
                        
                        {/* Button */}
                        <Link
                            to="/janji-temu"
                            className="w-full bg-[#00B4D8] hover:bg-[#0096C7] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
                        >
                            Buat Jadwal
                        </Link>
                    </div>
                </div>

                {/* Card 2: Peminjaman Fasilitas */}
                <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow border-t-[6px] border-[#10B981]">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className="w-14 h-14 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-5">
                            <svg className="w-7 h-7 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-lg font-bold text-gray-900 mb-3">
                            Peminjaman Fasilitas
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-600 mb-6 text-xs leading-relaxed">
                            Ajukan permohonan peminjaman laboratorium komputer, ruang server, atau peralatan multimedia.
                        </p>
                        
                        {/* Button */}
                        <Link
                            to="/peminjaman"
                            className="w-full bg-[#00B4D8] hover:bg-[#0096C7] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
                        >
                            Ajukan Pinjaman
                        </Link>
                    </div>
                </div>
            </div>

            {/* Informasi Layanan Section */}
            <div className="bg-white rounded-2xl shadow-sm p-10 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
                    Informasi Layanan
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Jam Operasional */}
                    <div>
                        <h3 className="text-base font-bold text-[#0096C7] mb-3">
                            Jam Operasional
                        </h3>
                        <div className="text-gray-700 text-xs space-y-1">
                            <p>Senin - Kamis: 08.00 - 16.00 WIB</p>
                            <p>Jumat: 08.00 - 16.30 WIB</p>
                            <p className="text-gray-500">Sabtu - Minggu: Tutup</p>
                        </div>
                    </div>

                    {/* Layanan Utama */}
                    <div>
                        <h3 className="text-base font-bold text-[#0096C7] mb-3">
                            Layanan Utama
                        </h3>
                        <ul className="text-gray-700 text-xs space-y-1 list-none pl-0">
                            <li>• Maintenance Jaringan & Server</li>
                            <li>• Pengembangan Sistem Informasi</li>
                            <li>• Akses SSO & Email Unila</li>
                        </ul>
                    </div>

                    {/* Pusat Bantuan */}
                    <div>
                        <h3 className="text-base font-bold text-[#0096C7] mb-3">
                            Pusat Bantuan
                        </h3>
                        <div className="text-gray-700 text-xs space-y-1">
                            <p>Silakan hubungi kami jika mengalami kendala dalam sistem ini:</p>
                            <a href="mailto:helpdesk@tik.unila.ac.id" className="text-[#0096C7] hover:underline font-medium block">
                                helpdesk@tik.unila.ac.id
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
