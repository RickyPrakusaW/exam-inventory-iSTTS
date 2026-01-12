import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Settings } from 'lucide-react';
import { getCurrentUser, updateProfile } from '../services/authService';
import PageHeader from '../components/PageHeader';

const Pengaturan = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        currentEmail: '',
        newEmail: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Get current user data
        const user = getCurrentUser();
        if (user && user.email) {
            setFormData(prev => ({
                ...prev,
                currentEmail: user.email || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear message when user types
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const validateForm = () => {
        // Validate email change
        if (formData.newEmail && formData.newEmail !== formData.currentEmail) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
                setMessage({ type: 'error', text: 'Format email tidak valid' });
                return false;
            }
        }

        // Validate password change
        if (formData.newPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                setMessage({ type: 'error', text: 'Password lama harus diisi untuk mengganti password' });
                return false;
            }
            
            if (formData.newPassword.length < 6) {
                setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
                return false;
            }
            
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Password baru dan konfirmasi password tidak sama' });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) {
            return;
        }

        // Check if there are any changes
        const hasEmailChange = formData.newEmail && formData.newEmail !== formData.currentEmail;
        const hasPasswordChange = formData.newPassword && formData.newPassword.length > 0;

        if (!hasEmailChange && !hasPasswordChange) {
            setMessage({ type: 'error', text: 'Tidak ada perubahan yang dilakukan' });
            return;
        }

        setLoading(true);

        try {
            const updateData = {};
            if (hasEmailChange) {
                updateData.email = formData.newEmail;
            }
            if (hasPasswordChange) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const response = await updateProfile(updateData);

            if (response.success) {
                setMessage({ 
                    type: 'success', 
                    text: response.message || 'Pengaturan akun berhasil diubah' 
                });
                
                // Update local storage if email changed
                if (hasEmailChange) {
                    localStorage.setItem('userEmail', formData.newEmail);
                }
                
                // Reset form except current email
                setFormData(prev => ({
                    currentEmail: hasEmailChange ? formData.newEmail : prev.currentEmail,
                    newEmail: '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                setMessage({ 
                    type: 'error', 
                    text: response.message || 'Gagal mengubah pengaturan akun' 
                });
            }
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.message || 'Terjadi kesalahan. Silakan coba lagi.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <PageHeader 
                title="Pengaturan Akun" 
                subtitle="Kelola informasi akun dan keamanan Anda"
                icon={Settings}
            />

            {/* Message Alert */}
            {message.text && (
                <div className={`p-4 rounded-xl md:rounded-2xl border flex items-start gap-3 ${
                    message.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium flex-1">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-6 md:space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                            {/* Change Email Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <Mail className="w-5 h-5 text-rose-600" />
                                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                                        Email & Kontak
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Saat Ini
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                            <input
                                                type="email"
                                                name="currentEmail"
                                                value={formData.currentEmail}
                                                disabled
                                                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl text-gray-600 cursor-not-allowed text-sm md:text-base"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Baru
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                            <input
                                                type="email"
                                                name="newEmail"
                                                value={formData.newEmail}
                                                onChange={handleChange}
                                                placeholder="Masukkan email baru"
                                                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                                            />
                                        </div>
                                        <p className="mt-1.5 text-xs text-gray-500">
                                            Kosongkan jika tidak ingin mengubah email
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Change Password Section */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <Lock className="w-5 h-5 text-rose-600" />
                                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                                        Keamanan
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password Lama
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                placeholder="Masukkan password lama"
                                                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                                                ) : (
                                                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Masukkan password baru (min. 6 karakter)"
                                                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                                                ) : (
                                                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Konfirmasi Password Baru
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Konfirmasi password baru"
                                                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                                                ) : (
                                                    <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>Simpan Perubahan</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-rose-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-rose-600 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Tips Keamanan
                            </h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold mt-0.5">•</span>
                                <span>Gunakan password yang kuat dengan kombinasi huruf, angka, dan karakter khusus</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold mt-0.5">•</span>
                                <span>Jangan gunakan password yang sama dengan akun lain</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold mt-0.5">•</span>
                                <span>Pastikan email baru sudah aktif dan dapat diakses</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold mt-0.5">•</span>
                                <span>Setelah mengubah password, Anda perlu login ulang</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pengaturan;
