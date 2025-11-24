import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuestLayout from '../Layouts/GuestLayout';
import InputLabel from '../Components/InputLabel';
import TextInput from '../Components/TextInput';
import SelectInput from '../Components/SelectInput';
import FileInput from '../Components/FileInput';
import PrimaryButton from '../Components/PrimaryButton';
import InputError from '../Components/InputError';

// Floating Toast Component
function FloatingToast({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-base">{message}</span>
            </div>
        </div>
    );
}

export default function Peminjaman({ fasilitasOptions }) {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [data, setData] = useState({
        nama: '',
        email: '',
        instansi: '',
        no_telp: '',
        barang: '',
        detail_kebutuhan: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        surat_pengantar: null,
    });

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:8000/peminjaman', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const message = response.data.message || 'Permohonan Berhasil! Bukti formulir telah dikirim ke email Anda.';
            setSuccessMessage(message);
            setShowToast(true);
            
            // Reset form
            setData({
                nama: '',
                email: '',
                instansi: '',
                no_telp: '',
                barang: '',
                detail_kebutuhan: '',
                tanggal_mulai: '',
                tanggal_selesai: '',
                surat_pengantar: null,
            });
            
            // Reset file input
            const fileInput = document.getElementById('surat_pengantar');
            if (fileInput) fileInput.value = '';
            
            // Navigate to home after 5 seconds
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: [error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <GuestLayout>
            {/* Floating Toast Notification */}
            {showToast && successMessage && (
                <FloatingToast 
                    message={successMessage} 
                    onClose={() => setShowToast(false)} 
                />
            )}

            <div className="max-w-4xl mx-auto">
                {/* Professional Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">
                        Formulir Peminjaman
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Lengkapi data untuk mengajukan penggunaan fasilitas
                    </p>
                </div>

                {/* Modern Form Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-10">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Group 1: Identity */}
                        <div className="space-y-6">
                            <div className="border-l-4 border-sky-500 pl-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Data Peminjam
                                </h2>
                            </div>
                            
                            {/* Grid: Nama + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama */}
                                <div>
                                    <InputLabel htmlFor="nama" value="Nama Peminjam" />
                                    <TextInput
                                        id="nama"
                                        type="text"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        placeholder="Nama lengkap"
                                        value={data.nama}
                                        onChange={(e) => handleChange('nama', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError message={errors.nama?.[0]} className="mt-2" />
                                </div>

                                {/* Email */}
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        placeholder="email@example.com"
                                        value={data.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email?.[0]} className="mt-2" />
                                </div>
                            </div>
                            
                            {/* Grid: Instansi + No Telp */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Instansi */}
                                <div>
                                    <InputLabel htmlFor="instansi" value="Instansi / Unit" />
                                    <TextInput
                                        id="instansi"
                                        type="text"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        placeholder="Nama instansi atau unit kerja"
                                        value={data.instansi}
                                        onChange={(e) => handleChange('instansi', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.instansi?.[0]} className="mt-2" />
                                </div>

                                {/* No Telp */}
                                <div>
                                    <InputLabel htmlFor="no_telp" value="Nomor Telepon" />
                                    <TextInput
                                        id="no_telp"
                                        type="tel"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        placeholder="08xxxxxxxxxx"
                                        value={data.no_telp}
                                        onChange={(e) => handleChange('no_telp', e.target.value)}
                                    />
                                    <InputError message={errors.no_telp?.[0]} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Group 2: Loan Details */}
                        <div className="space-y-6 pt-4">
                            <div className="border-l-4 border-sky-500 pl-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Detail Peminjaman
                                </h2>
                            </div>
                            
                            {/* Grid: Barang + Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Barang/Fasilitas */}
                                <div>
                                    <InputLabel htmlFor="barang" value="Barang/Fasilitas" />
                                    <SelectInput
                                        id="barang"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        value={data.barang}
                                        onChange={(e) => handleChange('barang', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih --</option>
                                        {fasilitasOptions && fasilitasOptions.map((fasilitas, index) => (
                                            <option key={index} value={fasilitas}>
                                                {fasilitas}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <InputError message={errors.barang?.[0]} className="mt-2" />
                                </div>

                                {/* Tanggal Mulai */}
                                <div>
                                    <InputLabel htmlFor="tanggal_mulai" value="Tanggal Mulai" />
                                    <TextInput
                                        id="tanggal_mulai"
                                        type="date"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.tanggal_mulai?.[0]} className="mt-2" />
                                </div>

                                {/* Tanggal Selesai */}
                                <div>
                                    <InputLabel htmlFor="tanggal_selesai" value="Tanggal Selesai" />
                                    <TextInput
                                        id="tanggal_selesai"
                                        type="date"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.tanggal_selesai?.[0]} className="mt-2" />
                                </div>
                            </div>

                            {/* Detail Kebutuhan - Full Width */}
                            <div>
                                <InputLabel htmlFor="detail_kebutuhan" value="Detail Kebutuhan (Opsional)" />
                                <textarea
                                    id="detail_kebutuhan"
                                    className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base border-gray-300 focus:border-sky-500 focus:ring focus:ring-sky-200 focus:ring-opacity-50 rounded-lg shadow-sm"
                                    placeholder="Jelaskan detail kebutuhan atau keperluan peminjaman..."
                                    rows="4"
                                    value={data.detail_kebutuhan}
                                    onChange={(e) => handleChange('detail_kebutuhan', e.target.value)}
                                />
                                <InputError message={errors.detail_kebutuhan?.[0]} className="mt-2" />
                            </div>
                        </div>

                        {/* Group 4: Document Upload */}
                        <div className="space-y-6 pt-4">
                            <div className="border-l-4 border-sky-500 pl-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Dokumen Pendukung
                                </h2>
                            </div>
                            
                            {/* Upload Area - Styled as Dropzone */}
                            <div>
                                <InputLabel htmlFor="surat_pengantar" value="Surat Pengantar / Permohonan" />
                                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-white hover:border-sky-400 transition-all p-6">
                                    <FileInput
                                        id="surat_pengantar"
                                        className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setData(prev => ({ ...prev, surat_pengantar: e.target.files[0] }))}
                                        required
                                    />
                                    <p className="mt-3 text-sm text-slate-500 text-center">
                                        Format: PDF, JPG, PNG (Maksimal 5MB)
                                    </p>
                                    {data.surat_pengantar && (
                                        <p className="mt-2 text-sm text-sky-600 font-medium text-center">
                                            File terpilih: {data.surat_pengantar.name}
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.surat_pengantar?.[0]} className="mt-2" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <PrimaryButton 
                                className="w-full py-4 text-base font-bold tracking-wide transform hover:scale-[1.02] transition-transform" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengupload & Mengirim...
                                    </span>
                                ) : 'Ajukan Permohonan Peminjaman'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
