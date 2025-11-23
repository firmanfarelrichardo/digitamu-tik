import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GuestLayout from '../Layouts/GuestLayout';
import InputLabel from '../Components/InputLabel';
import TextInput from '../Components/TextInput';
import SelectInput from '../Components/SelectInput';
import TextArea from '../Components/TextArea';
import PrimaryButton from '../Components/PrimaryButton';
import InputError from '../Components/InputError';

export default function JanjiTemu({ staffOptions }) {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        nama: '',
        email: '',
        no_telp: '',
        bertemu_siapa: '',
        waktu_janji_temu: '',
        topik_diskusi: '',
    });

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await axios.post('http://localhost:8000/janji-temu', data);
            alert('Janji temu berhasil dibuat! Silakan tunggu konfirmasi dari staff.');
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
                        Jadwalkan Janji Temu
                    </h1>
                    <p className="text-gray-600">
                        Silakan lengkapi formulir untuk membuat janji dengan staff atau administrasi UPA TIK tanpa harus datang mengantri.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Lengkap" />
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
                            <InputLabel htmlFor="no_telp" value="Nomor Telepon (Opsional)" />
                            <TextInput
                                id="no_telp"
                                type="tel"
                                placeholder="08123456789"
                                value={data.no_telp}
                                onChange={(e) => handleChange('no_telp', e.target.value)}
                            />
                            <InputError message={errors.no_telp?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="bertemu_siapa" value="Ingin Bertemu Siapa?" />
                            <SelectInput
                                id="bertemu_siapa"
                                value={data.bertemu_siapa}
                                onChange={(e) => handleChange('bertemu_siapa', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Layanan --</option>
                                {staffOptions.map((staff, index) => (
                                    <option key={index} value={staff}>
                                        {staff}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.bertemu_siapa?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="waktu_janji_temu" value="Rencana Tanggal & Waktu" />
                            <TextInput
                                id="waktu_janji_temu"
                                type="datetime-local"
                                value={data.waktu_janji_temu}
                                onChange={(e) => handleChange('waktu_janji_temu', e.target.value)}
                                required
                            />
                            <InputError message={errors.waktu_janji_temu?.[0]} />
                        </div>

                        <div>
                            <InputLabel htmlFor="topik_diskusi" value="Topik Diskusi" />
                            <TextArea
                                id="topik_diskusi"
                                placeholder="Jelaskan secara singkat topik yang ingin dibahas..."
                                value={data.topik_diskusi}
                                onChange={(e) => handleChange('topik_diskusi', e.target.value)}
                                rows={4}
                                required
                            />
                            <InputError message={errors.topik_diskusi?.[0]} />
                        </div>

                        <div className="pt-4">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Mengirim...' : 'Buat Janji Temu'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
