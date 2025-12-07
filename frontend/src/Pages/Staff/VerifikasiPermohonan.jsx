import { useState, useEffect } from 'react';
import { Calendar, MapPin, FileText, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import StaffLayout from '../../Layouts/StaffLayout';

const API_URL = 'http://localhost:8000';

export default function VerifikasiPermohonan() {
    // State untuk data dari API
    const [permohonanList, setPermohonanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // State untuk modal detail
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // State untuk modal tolak (alasan penolakan)
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectItem, setRejectItem] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    // State untuk modal konfirmasi setuju
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approveItem, setApproveItem] = useState(null);

    // State untuk notifikasi
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    // Fetch permohonan data
    const fetchPermohonan = async () => {
        try {
            const response = await axios.get(`${API_URL}/staff/permohonan`);
            if (response.data.success) {
                setPermohonanList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching permohonan:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermohonan();
    }, []);

    // Handle buka modal detail
    const handleOpenDetail = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // Handle tutup modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    // Handle buka modal tolak
    const handleOpenRejectModal = (item) => {
        setRejectItem(item);
        setRejectReason('');
        setShowRejectModal(true);
    };

    // Handle tutup modal tolak
    const handleCloseRejectModal = () => {
        setShowRejectModal(false);
        setRejectItem(null);
        setRejectReason('');
    };

    // Handle buka modal konfirmasi setuju
    const handleOpenApproveModal = (item) => {
        setApproveItem(item);
        setShowApproveModal(true);
    };

    // Handle tutup modal konfirmasi setuju
    const handleCloseApproveModal = () => {
        setShowApproveModal(false);
        setApproveItem(null);
    };

    // Fungsi untuk menampilkan notifikasi
    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    const handleTolak = async () => {
        if (actionLoading || !rejectItem) return;
        
        if (!rejectReason.trim()) {
            showNotification('error', 'Silakan masukkan alasan penolakan.');
            return;
        }

        setActionLoading(rejectItem.id);
        try {
            const response = await axios.post(`${API_URL}/staff/permohonan/reject`, {
                id: rejectItem.id,
                type: rejectItem.type,
                alasan_penolakan: rejectReason.trim(),
            });
            if (response.data.success) {
                // Remove from list
                setPermohonanList(prev => prev.filter(item => item.id !== rejectItem.id));
                handleCloseRejectModal();
                showNotification('success', 'Permohonan berhasil ditolak.');
            }
        } catch (error) {
            console.error('Error reject:', error);
            showNotification('error', 'Gagal menolak permohonan. Silakan coba lagi.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSetujui = async () => {
        if (actionLoading || !approveItem) return;

        setActionLoading(approveItem.id);
        try {
            const response = await axios.post(`${API_URL}/staff/permohonan/approve`, {
                id: approveItem.id,
                type: approveItem.type,
            });
            if (response.data.success) {
                // Remove from list
                setPermohonanList(prev => prev.filter(item => item.id !== approveItem.id));
                handleCloseApproveModal();
                showNotification('success', 'Permohonan berhasil disetujui.');
            }
        } catch (error) {
            console.error('Error approve:', error);
            showNotification('error', 'Gagal menyetujui permohonan. Silakan coba lagi.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <StaffLayout>
            {/* Notifikasi */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-[100] animate-slide-in">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                        notification.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                    }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <XCircle size={20} />
                        )}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Daftar Permohonan Masuk</h1>
                <p className="text-slate-500 text-sm mt-0.5">Persetujuan janji temu dan peminjaman fasilitas.</p>
            </div>

            {/* Permohonan Cards */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-10 text-center">
                        <p className="text-slate-500 text-sm">Memuat data...</p>
                    </div>
                ) : permohonanList.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-100 p-10 text-center">
                        <p className="text-slate-500 text-sm">Tidak ada permohonan yang perlu diverifikasi.</p>
                    </div>
                ) : (
                    permohonanList.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg border border-gray-100 p-5 border-l-4 border-l-[#f59e0b]"
                        >
                            <div className="flex justify-between items-start">
                                {/* Left Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-bold text-slate-800">
                                            {item.namaDisplay || item.nama}
                                        </h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            item.type === 'janji-temu' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {item.type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman'}
                                        </span>
                                    </div>
                                    
                                    {/* Deskripsi - format berbeda untuk janji temu dan peminjaman */}
                                    {item.type === 'peminjaman' ? (
                                        <div className="text-slate-600 text-sm mb-3 space-y-1">
                                            <p><span className="font-medium">Barang/Fasilitas:</span> {item.judulPermohonan}</p>
                                            {item.detailKebutuhan && (
                                                <p className="text-slate-500"><span className="font-medium text-slate-600">Detail:</span> {item.detailKebutuhan}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-slate-600 text-sm mb-3 space-y-1">
                                            {item.bertemuDengan && item.bertemuDengan !== '-' && (
                                                <p><span className="font-medium">Bertemu dengan:</span> {item.bertemuDengan}</p>
                                            )}
                                            {item.topikDiskusi && (
                                                <p className="text-slate-500"><span className="font-medium text-slate-600">Topik Diskusi:</span> {item.topikDiskusi}</p>
                                            )}
                                        </div>
                                    )}
                                    
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
                                        onClick={() => handleOpenDetail(item)}
                                        className="bg-slate-500 hover:bg-slate-600 text-white p-2 rounded-md transition-colors"
                                        title="Lihat Detail"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenRejectModal(item)}
                                        disabled={actionLoading === item.id}
                                        className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === item.id ? '...' : 'Tolak'}
                                    </button>
                                    <button
                                        onClick={() => handleOpenApproveModal(item)}
                                        disabled={actionLoading === item.id}
                                        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                        {actionLoading === item.id ? '...' : 'Setujui'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Detail */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Detail {selectedItem.type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman'}
                                </h2>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    selectedItem.type === 'janji-temu' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {selectedItem.type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman Fasilitas'}
                                </span>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Info Pemohon */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nama</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.nama}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Instansi</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.instansi}</p>
                                </div>
                            </div>

                            {/* Kontak */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Telepon</label>
                                    <p className="text-sm text-slate-800 mt-1">{selectedItem.noTelp || '-'}</p>
                                </div>
                            </div>

                            {/* Konten berbeda berdasarkan tipe */}
                            {selectedItem.type === 'janji-temu' ? (
                                <>
                                    {/* Keperluan Janji Temu */}
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Keperluan</label>
                                        <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                                            {selectedItem.deskripsi}
                                        </p>
                                    </div>

                                    {/* Waktu */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</label>
                                            <p className="text-sm text-slate-800 mt-1">{selectedItem.tanggalRaw || selectedItem.tanggal}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jam</label>
                                            <p className="text-sm text-slate-800 mt-1">{selectedItem.jamRaw || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Bertemu dengan */}
                                    {selectedItem.lokasi && (
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bertemu Dengan</label>
                                            <p className="text-sm text-slate-800 mt-1">{selectedItem.lokasi}</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Judul Permohonan Peminjaman */}
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Judul Permohonan</label>
                                        <p className="text-sm text-slate-800 mt-1">{selectedItem.judulPermohonan}</p>
                                    </div>

                                    {/* Detail Kebutuhan */}
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Detail Kebutuhan</label>
                                        <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                                            {selectedItem.detailKebutuhan || '-'}
                                        </p>
                                    </div>

                                    {/* Tanggal Peminjaman */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal Mulai</label>
                                            <p className="text-sm text-slate-800 mt-1">{selectedItem.tanggalMulai}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal Selesai</label>
                                            <p className="text-sm text-slate-800 mt-1">{selectedItem.tanggalSelesai}</p>
                                        </div>
                                    </div>

                                    {/* Lampiran */}
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lampiran Surat</label>
                                        <div className="mt-2">
                                            {selectedItem.hasBerkas && selectedItem.berkasUrl ? (
                                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                    {selectedItem.berkasUrl.toLowerCase().endsWith('.pdf') ? (
                                                        <iframe
                                                            src={`${API_URL}/storage/${selectedItem.berkasUrl}`}
                                                            className="w-full h-96"
                                                            title="Preview Surat"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={selectedItem.berkasUrl}
                                                            alt="Lampiran Surat"
                                                            className="w-full max-h-96 object-contain bg-gray-100"
                                                        />
                                                    )}
                                                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                                                        <a
                                                            href={selectedItem.berkasUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-[#0ea5e9] hover:text-[#0284c7] text-sm font-medium"
                                                        >
                                                            <FileText size={16} />
                                                            Buka di Tab Baru
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-500 bg-gray-50 p-4 rounded-md text-center">
                                                    Tidak ada lampiran surat
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={handleCloseModal}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tolak dengan Alasan */}
            {showRejectModal && rejectItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Tolak Permohonan
                            </h2>
                            <button
                                onClick={handleCloseRejectModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <p className="text-sm text-slate-600 mb-2">
                                    Anda akan menolak permohonan dari:
                                </p>
                                <p className="font-medium text-slate-800">{rejectItem.nama}</p>
                                <p className="text-sm text-slate-500">
                                    {rejectItem.type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman'} - {rejectItem.tanggal}
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    placeholder="Masukkan alasan penolakan..."
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={handleCloseRejectModal}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleTolak}
                                disabled={actionLoading === rejectItem.id || !rejectReason.trim()}
                                className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === rejectItem.id ? 'Memproses...' : 'Tolak Permohonan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Setuju */}
            {showApproveModal && approveItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Konfirmasi Persetujuan
                            </h2>
                            <button
                                onClick={handleCloseApproveModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <CheckCircle size={32} className="text-[#0ea5e9]" />
                                </div>
                            </div>
                            <p className="text-center text-slate-600 mb-4">
                                Apakah Anda yakin ingin <strong className="text-[#0ea5e9]">menyetujui</strong> permohonan ini?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-slate-800">{approveItem.nama}</p>
                                <p className="text-sm text-slate-500">
                                    {approveItem.type === 'janji-temu' ? 'Janji Temu' : 'Peminjaman Fasilitas'}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">{approveItem.tanggal}</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                            <button
                                onClick={handleCloseApproveModal}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSetujui}
                                disabled={actionLoading === approveItem.id}
                                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === approveItem.id ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
