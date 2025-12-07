import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuestLayout from '../Layouts/GuestLayout';
import InputLabel from '../Components/InputLabel';
import TextInput from '../Components/TextInput';
import SelectInput from '../Components/SelectInput';
import TextArea from '../Components/TextArea';
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

export default function JanjiTemu({ staffOptions }) {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [data, setData] = useState({
        nama: '',
        email: '',
        bertemu_siapa: '',
        bertemu_siapa_custom: '',
        waktu_janji_temu: '',
        topik_diskusi: '',
    });

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        // Prepare data - use custom input if "Lainnya" is selected
        const submitData = {
            ...data,
            bertemu_siapa: data.bertemu_siapa === 'Lainnya' ? data.bertemu_siapa_custom : data.bertemu_siapa,
        };

        try {
            const response = await axios.post('http://localhost:8000/janji-temu', submitData);
            const message = response.data.message || 'Permohonan Berhasil! Bukti formulir telah dikirim ke email Anda.';
            
            setSuccessMessage(message);
            setShowToast(true);
            
            // Reset form
            setData({
                nama: '',
                email: '',
                bertemu_siapa: '',
                bertemu_siapa_custom: '',
                waktu_janji_temu: '',
                topik_diskusi: '',
            });
            setShowCustomInput(false);
            
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
        
        // Show/hide custom input when "Lainnya" is selected
        if (field === 'bertemu_siapa') {
            setShowCustomInput(value === 'Lainnya');
            // Clear custom input if not "Lainnya"
            if (value !== 'Lainnya') {
                setData(prev => ({ ...prev, bertemu_siapa_custom: '' }));
            }
        }
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
                        Jadwalkan Kunjungan
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Kami siap melayani kebutuhan konsultasi dan teknis Anda
                    </p>
                </div>

                {/* Modern Form Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 p-10">
                    <form onSubmit={submit} className="space-y-8">
                        {/* Group 1: Personal Information */}
                        <div className="space-y-6">
                            <div className="border-l-4 border-sky-500 pl-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Informasi Personal
                                </h2>
                            </div>
                            
                            {/* Name - Full Width */}
                            <div>
                                <InputLabel htmlFor="nama" value="Nama Lengkap" />
                                <TextInput
                                    id="nama"
                                    type="text"
                                    className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                    placeholder="Masukkan nama lengkap Anda"
                                    value={data.nama}
                                    onChange={(e) => handleChange('nama', e.target.value)}
                                    required
                                    isFocused
                                />
                                <InputError message={errors.nama?.[0]} className="mt-2" />
                            </div>

                            {/* Email - Full Width */}
                            <div>
                                <InputLabel htmlFor="email" value="Alamat Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                    placeholder="nama@example.com"
                                    value={data.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email?.[0]} className="mt-2" />
                            </div>
                        </div>

                        {/* Group 2: Appointment Details */}
                        <div className="space-y-6 pt-4">
                            <div className="border-l-4 border-sky-500 pl-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Detail Kunjungan
                                </h2>
                            </div>
                            
                            {/* Grid: Bertemu Siapa + Waktu */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bertemu Siapa */}
                                <div>
                                    <InputLabel htmlFor="bertemu_siapa" value="Tujuan Bertemu" />
                                    <SelectInput
                                        id="bertemu_siapa"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        value={data.bertemu_siapa}
                                        onChange={(e) => handleChange('bertemu_siapa', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Pilih Tujuan --</option>
                                        {staffOptions && staffOptions.map((staff, index) => (
                                            <option key={index} value={staff}>
                                                {staff}
                                            </option>
                                        ))}
                                        <option value="Lainnya">Lainnya</option>
                                    </SelectInput>
                                    <InputError message={errors.bertemu_siapa?.[0]} className="mt-2" />
                                    
                                    {/* Custom Input for "Lainnya" */}
                                    {showCustomInput && (
                                        <div className="mt-3">
                                            <TextInput
                                                id="bertemu_siapa_custom"
                                                type="text"
                                                className="block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                                placeholder="Tuliskan tujuan kunjungan Anda..."
                                                value={data.bertemu_siapa_custom}
                                                onChange={(e) => handleChange('bertemu_siapa_custom', e.target.value)}
                                                required
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Contoh: Konsultasi masalah jaringan, Pengambilan dokumen, dll.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Waktu */}
                                <div>
                                    <InputLabel htmlFor="waktu_janji_temu" value="Tanggal & Waktu" />
                                    <TextInput
                                        id="waktu_janji_temu"
                                        type="datetime-local"
                                        className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base"
                                        value={data.waktu_janji_temu}
                                        onChange={(e) => handleChange('waktu_janji_temu', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.waktu_janji_temu?.[0]} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Group 3: Context */}
                        <div className="space-y-6 pt-4">
                            <div className="border-l-4 border-sky-500 pl-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                    Topik Pembahasan
                                </h2>
                            </div>
                            
                            {/* Topik Diskusi - Full Width */}
                            <div>
                                <InputLabel htmlFor="topik_diskusi" value="Deskripsi Keperluan" />
                                <TextArea
                                    id="topik_diskusi"
                                    className="mt-2 block w-full bg-gray-50 focus:bg-white transition-colors px-4 py-3 text-base resize-none"
                                    placeholder="Jelaskan secara detail topik yang ingin Anda diskusikan..."
                                    value={data.topik_diskusi}
                                    onChange={(e) => handleChange('topik_diskusi', e.target.value)}
                                    rows={5}
                                    required
                                />
                                <InputError message={errors.topik_diskusi?.[0]} className="mt-2" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <PrimaryButton 
                                className="w-full py-4 text-base font-bold tracking-wide transform hover:scale-[1.02] transition-transform" 
                                disabled={processing}
                            >
                                {processing ? 'Mengirim Formulir...' : 'Kirim Permohonan Kunjungan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
