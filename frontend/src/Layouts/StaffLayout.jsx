import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, History, LogOut, FileText } from 'lucide-react';
import api from '../lib/axios';

export default function StaffLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/user');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    // Generate initials from name
    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get role display text
    const getRoleDisplay = (role) => {
        return role === 'admin' ? 'Administrator' : 'Staff TIK';
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/login');
        }
    };

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/staff',
            icon: LayoutDashboard,
        },
        {
            name: 'Verifikasi Permohonan',
            path: '/staff/verifikasi',
            icon: ClipboardCheck,
        },
        {
            name: 'Riwayat Tamu',
            path: '/staff/riwayat',
            icon: History,
        },
        {
            name: 'Riwayat Peminjaman',
            path: '/staff/riwayat-peminjaman',
            icon: FileText,
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className="w-[160px] bg-[#1e293b] text-white flex flex-col fixed h-full">
                {/* Logo/Title */}
                <div className="px-4 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-white" />
                        <span className="text-base font-semibold">
                            Portal <span className="text-[#22d3ee]">TIK</span>
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-md transition-all duration-200 ${
                                            isActive
                                                ? 'bg-[#0ea5e9] text-white'
                                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        <span className="text-xs font-medium">{item.name}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="px-3 py-4 border-t border-slate-700">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 transition-colors w-full"
                    >
                        <LogOut size={16} />
                        <span className="text-xs font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-[160px]">
                {/* Top Header */}
                <header className="bg-white shadow-sm px-6 py-3 flex justify-end items-center sticky top-0 z-10 border-b border-gray-100">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-800">{user?.name || 'Loading...'}</p>
                            <p className="text-xs text-slate-500">{getRoleDisplay(user?.role)}</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-semibold text-xs">{getInitials(user?.name)}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
