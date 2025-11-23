import logoUnila from '../assets/logo_unila.png';
import logoUpatik from '../assets/logo_upatik.png';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
            {/* Topographic Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="topographic" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                            <path d="M 0 50 Q 50 0 100 50 T 200 50" fill="none" stroke="#374151" strokeWidth="0.5"/>
                            <path d="M 0 100 Q 50 50 100 100 T 200 100" fill="none" stroke="#374151" strokeWidth="0.5"/>
                            <path d="M 0 150 Q 50 100 100 150 T 200 150" fill="none" stroke="#374151" strokeWidth="0.5"/>
                            <circle cx="100" cy="100" r="30" fill="none" stroke="#374151" strokeWidth="0.5"/>
                            <circle cx="100" cy="100" r="50" fill="none" stroke="#374151" strokeWidth="0.5"/>
                            <circle cx="100" cy="100" r="70" fill="none" stroke="#374151" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#topographic)"/>
                </svg>
            </div>

            {/* Header */}
            <header className="bg-[#4EAEE8] relative z-10">
                <div className="container mx-auto px-8 py-4">
                    <div className="flex justify-between items-center">
                        {/* Left: Unila Logo */}
                        <div className="flex items-center">
                            <img src={logoUnila} alt="Logo Unila" className="h-14" />
                        </div>

                        {/* Right: UPA TIK Logo */}
                        <div className="flex items-center">
                            <img src={logoUpatik} alt="Logo UPA TIK" className="h-12" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="grow container mx-auto px-6 py-8 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#1F2937] text-white py-10 relative z-10 mt-auto">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* UPT TIK Unila */}
                        <div>
                            <h3 className="text-sm font-bold mb-3 text-white">UPA TIK Unila</h3>
                            <p className="text-gray-300 text-xs leading-relaxed">
                                Gedung TIK Universitas Lampung<br/>
                                Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1<br/>
                                Gedong Meneng, Bandar Lampung, 35145
                            </p>
                        </div>

                        {/* Kontak Kami */}
                        <div>
                            <h3 className="text-sm font-bold mb-3 text-white">Kontak Kami</h3>
                            <ul className="text-gray-300 text-xs space-y-1">
                                <li>Email: helpdesk@tik.unila.ac.id</li>
                                <li>Telepon: (0721) 701609</li>
                                <li>WhatsApp: +62 812-3456-7890</li>
                            </ul>
                        </div>

                        {/* Tautan Cepat */}
                        <div>
                            <h3 className="text-sm font-bold mb-3 text-white">Tautan Cepat</h3>
                            <ul className="text-gray-300 text-xs space-y-1">
                                <li><a href="https://unila.ac.id" className="hover:text-blue-400 transition">Website Unila</a></li>
                                <li><a href="https://unila.ac.id/tik" className="hover:text-blue-400 transition">Website UPA TIK</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">Panduan Penggunaan</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-xs">
                        © 2025 Tim Pengembang Web Framework - DigiTamu TIK. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
