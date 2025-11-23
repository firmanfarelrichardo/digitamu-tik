import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuestLayout from '../Layouts/GuestLayout';
import InputLabel from '../Components/InputLabel';
import TextInput from '../Components/TextInput';
import SelectInput from '../Components/SelectInput';
import TextArea from '../Components/TextArea';
import FileInput from '../Components/FileInput';
import PrimaryButton from '../Components/PrimaryButton';
import InputError from '../Components/InputError';

export default function Peminjaman({ fasilitasOptions }) {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        nama: '',
        email: '',
        instansi: '',
        fasilitas: '',
        detail_kebutuhan: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        surat_pengantar: null,
    });

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        try {
            await axios.post('http://localhost:8000/peminjaman', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Permohonan peminjaman berhasil diajukan! Silakan tunggu konfirmasi dari staff.');
            navigate('/');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ error: ['Terjadi kesalahan. Silakan coba lagi.'] });
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
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Permohonan Peminjaman Fasilitas
                    </h1>
                    <p className="text-gray-600">
                        Ajukan permohonan peminjaman laboratorium komputer, ruang server, atau peralatan multimedia dengan mengisi formulir berikut.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Peminjam" />
                            <TextInput
                                id="nama"
                                type="text"
                                placeholder="Masukkan nama Anda"
                                value={data.nama}
                                onChange={(e) => handleChange('nama', e.target.value)}
                                required
                                isFocused
                            />
                            <InputError message={errors.nama?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={data.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="instansi" value="Asal Instansi / UKM" />
                            <TextInput
                                id="instansi"
                                type="text"
                                placeholder="Contoh: Fakultas Teknik / Umum"
                                value={data.instansi}
                                onChange={(e) => handleChange('instansi', e.target.value)}
                                required
                            />
                            <InputError message={errors.instansi?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="fasilitas" value="Fasilitas yang Dipinjam" />
                            <SelectInput
                                id="fasilitas"
                                value={data.fasilitas}
                                onChange={(e) => handleChange('fasilitas', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Fasilitas --</option>
                                {fasilitasOptions.map((fasilitas, index) => (
                                    <option key={index} value={fasilitas}>
                                        {fasilitas}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.fasilitas?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="detail_kebutuhan" value="Detail Kebutuhan (Opsional)" />
                            <TextArea
                                id="detail_kebutuhan"
                                placeholder="Jelaskan kebutuhan spesifik Anda (jumlah, spesifikasi, dll)..."
                                value={data.detail_kebutuhan}
                                onChange={(e) => handleChange('detail_kebutuhan', e.target.value)}
                                rows={3}
                            />
                            <InputError message={errors.detail_kebutuhan?.[0]} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="tanggal_mulai" value="Tanggal Mulai" />
                                <TextInput
                                    id="tanggal_mulai"
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => handleChange('tanggal_mulai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tanggal_mulai?.[0]} />
                            </div>

                            <div>
                                <InputLabel htmlFor="tanggal_selesai" value="Tanggal Selesai" />
                                <TextInput
                                    id="tanggal_selesai"
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
                                    required
                                />
                                <InputError message={errors.tanggal_selesai?.[0]} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="surat_pengantar" value="Upload Surat Pengantar" />
                            <FileInput
                                id="surat_pengantar"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleChange('surat_pengantar', e.target.files[0])}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Format: PDF, JPG, JPEG, PNG (Max 2MB)
                            </p>
                            <InputError message={errors.surat_pengantar?.[0]} />
                        </div>

                        <div className="pt-4">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Mengirim...' : 'Ajukan Permohonan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
