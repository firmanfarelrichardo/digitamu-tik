import { useState, useEffect } from 'react';
import { Plus, X, Loader2, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import api from '../../lib/axios';
import AdminLayout from '../../Layouts/AdminLayout';

export default function ManajemenStaff() {
    // State untuk data
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // State untuk delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const initialFormData = {
        nama: '',
        nip: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'staff',
        status: true,
    };

    const [formData, setFormData] = useState(initialFormData);

    // Fetch staff list on mount
    useEffect(() => {
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/staff');
            setStaffList(response.data);
        } catch (err) {
            console.error('Error fetching staff:', err);
            setError('Gagal memuat data staff');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        // Validate password confirmation
        if (!editMode && formData.password !== formData.password_confirmation) {
            setError('Konfirmasi password tidak cocok');
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                name: formData.nama,
                nip: formData.nip || null,
                email: formData.email,
                role: formData.role,
                is_active: formData.status,
            };

            // Only include password if provided
            if (formData.password) {
                payload.password = formData.password;
                payload.password_confirmation = formData.password_confirmation;
            }

            if (editMode) {
                await api.put(`/admin/staff/${editId}`, payload);
            } else {
                await api.post('/admin/staff', payload);
            }

            // Refresh list and close modal
            await fetchStaffList();
            closeModal();
        } catch (err) {
            console.error('Error saving staff:', err);
            if (err.response?.data?.errors) {
                const errors = Object.values(err.response.data.errors).flat();
                setError(errors.join(', '));
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Gagal menyimpan data staff');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (staff) => {
        setFormData({
            nama: staff.name,
            nip: staff.nip || '',
            email: staff.email,
            password: '',
            password_confirmation: '',
            role: staff.role,
            status: staff.is_active,
        });
        setEditMode(true);
        setEditId(staff.id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            await api.delete(`/admin/staff/${deleteTarget.id}`);
            await fetchStaffList();
            setShowDeleteModal(false);
            setDeleteTarget(null);
        } catch (err) {
            console.error('Error deleting staff:', err);
            setError('Gagal menghapus staff');
        }
    };

    const openDeleteModal = (staff) => {
        setDeleteTarget(staff);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData(initialFormData);
        setEditMode(false);
        setEditId(null);
        setError('');
        setShowPassword(false);
        setShowConfirmPassword(false);
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

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                    <span className="ml-2 text-slate-600">Memuat data...</span>
                </div>
            ) : (
                /* Staff Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">NIP</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                                            Belum ada data staff
                                        </td>
                                    </tr>
                                ) : (
                                    staffList.map((staff) => (
                                        <tr key={staff.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{staff.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{staff.email}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{staff.nip || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        staff.role === 'admin'
                                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                    }`}
                                                >
                                                    {staff.role === 'admin' ? 'Admin' : 'Staff'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-2 text-sm">
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${
                                                            staff.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                                                        }`}
                                                    ></span>
                                                    <span className={staff.is_active ? 'text-emerald-600' : 'text-slate-500'}>
                                                        {staff.is_active ? 'Aktif' : 'Non-Aktif'}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(staff)}
                                                        className="text-amber-500 hover:text-amber-600 text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <Pencil size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(staff)}
                                                        className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <Trash2 size={14} />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Edit Staff */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editMode ? 'Edit Staff' : 'Tambah Staff Baru'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nama Lengkap <span className="text-red-500">*</span>
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
                                    NIP
                                </label>
                                <input
                                    type="text"
                                    name="nip"
                                    value={formData.nip}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                                    placeholder="Masukkan NIP (opsional)"
                                    maxLength={20}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Email <span className="text-red-500">*</span>
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
                                    Password {!editMode && <span className="text-red-500">*</span>}
                                    {editMode && <span className="text-slate-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                                        placeholder="Masukkan password"
                                        required={!editMode}
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Konfirmasi Password {!editMode && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                                        placeholder="Ulangi password"
                                        required={!editMode && formData.password !== ''}
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm bg-white"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm bg-white"
                                    >
                                        <option value="true">Aktif</option>
                                        <option value="false">Non-Aktif</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                    disabled={submitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2.5 text-sm font-medium text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    {editMode ? 'Simpan Perubahan' : 'Tambah Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Staff?</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Anda yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteTarget(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
