import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';
import api from '../lib/axios';

export default function AdminLayout({ children }) {
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
        return role === 'admin' ? 'Administrator' : 'Staff';
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
            path: '/admin',
            icon: LayoutDashboard,
        },
        {
            name: 'Manajemen Staff',
            path: '/admin/manajemen-staff',
            icon: Users,
        },
        {
            name: 'Laporan & Data',
            path: '/admin/laporan',
            icon: FileText,
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e293b] text-white flex flex-col fixed h-full">
                {/* Logo/Title */}
                <div className="px-6 py-5 border-b border-slate-700">
                    <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-[#0ea5e9] text-white'
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="px-4 py-6 border-t border-slate-700">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full"
                    >
                        <LogOut size={20} />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
                {/* Top Header */}
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <div></div>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-800">{user?.name || 'Loading...'}</p>
                            <p className="text-xs text-slate-500">{getRoleDisplay(user?.role)}</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-semibold text-sm">{getInitials(user?.name)}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
