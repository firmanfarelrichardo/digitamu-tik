import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function ManajemenStaff() {
    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        role: 'Staff',
        status: 'Aktif',
    });

    // Data staff (dummy data untuk UI)
    const [staffList] = useState([
        {
            id: 1,
            nama: 'Bapak Kepala UPA',
            email: 'kepala@tik.unila.ac.id',
            role: 'Admin',
            status: 'Aktif',
        },
        {
            id: 2,
            nama: 'Petugas Front Office 1',
            email: 'staff01@tik.unila.ac.id',
            role: 'Staff',
            status: 'Aktif',
        },
        {
            id: 3,
            nama: 'Teknisi Jaringan',
            email: 'teknisi@tik.unila.ac.id',
            role: 'Staff',
            status: 'Non-Aktif',
        },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Untuk UI saja, tidak ada aksi backend
        console.log('Form submitted:', formData);
        setShowModal(false);
        setFormData({ nama: '', email: '', role: 'Staff', status: 'Aktif' });
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Kelola Pengguna Sistem</h1>
                    <p className="text-slate-500 text-sm mt-1">Tambah, ubah, atau hapus akses staff.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                >
                    <Plus size={18} />
                    Tambah Staff Baru
                </button>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email / NIP</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{staff.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{staff.email}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                staff.role === 'Admin'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            {staff.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2 text-sm">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    staff.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'
                                                }`}
                                            ></span>
                                            <span className={staff.status === 'Aktif' ? 'text-emerald-600' : 'text-slate-500'}>
                                                {staff.status}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-amber-500 hover:text-amber-600 text-sm font-medium transition-colors">
                                                Edit
                                            </button>
                                            {staff.role !== 'Admin' && (
                                                <button className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Staff */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-slate-800">Tambah Staff Baru</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Email / NIP
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                                    placeholder="contoh@tik.unila.ac.id"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm bg-white"
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm bg-white"
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Non-Aktif">Non-Aktif</option>
                                </select>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 text-sm font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
