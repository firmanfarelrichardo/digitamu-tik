import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoUpatik from '../../assets/logo_upatik.png';
import backgroundImg from '../../assets/background.png';

export default function Login() {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        akun_sso: '',
        password: '',
        remember: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/auth/login', {
                akun_sso: data.akun_sso,
                password: data.password,
                remember: data.remember,
            }, {
                withCredentials: true,
            });

            // Redirect berdasarkan role dari response backend
            if (response.data.redirect) {
                navigate(response.data.redirect);
            } else if (response.data.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/staff');
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f5f5f5]">
            {/* Background Image - Pattern Repeat */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${backgroundImg})`,
                    backgroundSize: '600px 300px',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center',
                    opacity: 0.7,
                }}
            />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            <img 
                                src={logoUpatik} 
                                alt="Logo UPA TIK" 
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#0ea5e9] mb-2">Portal Login</h1>
                        <p className="text-gray-500 text-sm">Silakan login untuk masuk ke dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Akun SSO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Akun SSO
                            </label>
                            <input
                                type="text"
                                name="akun_sso"
                                value={data.akun_sso}
                                onChange={handleChange}
                                placeholder="Masukkan akun SSO anda"
                                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        {/* Kata Sandi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kata Sandi
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Masukkan kata sandi"
                                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-sky-500 border-gray-300 rounded focus:ring-sky-500"
                                />
                                <span className="text-sm text-gray-600">Ingat Saya</span>
                            </label>
                            <a href="#" className="text-sm text-sky-500 hover:text-sky-600 hover:underline transition-colors">
                                Lupa sandi?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-3 px-4 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold rounded-lg transition-colors text-sm ${
                                processing ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            © 2025 UPT TIK Universitas Lampung
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
