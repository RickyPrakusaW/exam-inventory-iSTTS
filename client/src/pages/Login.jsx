import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, BookOpen, X } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState([]); // Array untuk menampung banyak error
    const navigate = useNavigate();

    // Fungsi untuk menambah error baru
    const addError = (message) => {
        const id = Date.now();
        const newError = { id, message, visible: true };
        setErrors((prev) => [...prev, newError]);

        // Mulai memudar setelah 2.7 detik (sebelum dihapus pada 3 detik)
        setTimeout(() => {
            setErrors((prev) =>
                prev.map((err) => (err.id === id ? { ...err, visible: false } : err))
            );
        }, 2700);

        // Hapus total setelah 3 detik
        setTimeout(() => {
            setErrors((prev) => prev.filter((err) => err.id !== id));
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            addError('Nama pengguna dan kata sandi harus diisi');
            return;
        }

        // Logic login visual (client-side only for now)
        if (username === '111' && password === '111') {
            // Admin login
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isAuthenticated', 'true');
            console.log('Admin logged in');
            navigate('/admin');
        } else if (username === '222' && password === '222') {
            // User login
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('isAuthenticated', 'true');
            console.log('User logged in');
            navigate('/home');
        } else {
            addError('Nama pengguna/kata sandi salah');
        }
    };

    return (
        // BACKGROUND UTAMA: Putih Soft / Abu-abu sangat muda agar bersih
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row border border-gray-100">

                {/* Left Side - Brand/Visual */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group bg-gray-50 min-h-[300px] md:min-h-full">
                    
                    {/* ELEMEN DEKORASI */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFE4E1] rounded-full mix-blend-multiply filter blur-3xl opacity-70 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFE4E1] rounded-full mix-blend-multiply filter blur-3xl opacity-70 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 md:mb-12">
                            {/* Icon Box */}
                            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                <BookOpen size={28} className="text-rose-400 md:w-8 md:h-8" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">Bank Soal iSTTS</h1>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
                                Welcome Back!
                            </h2>
                            <p className="text-gray-500 text-base md:text-lg max-w-sm">
                                Access the comprehensive exam inventory and management system.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 md:mt-12 text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} iSTTS. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12 relative flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Sign In</h3>
                        <p className="text-gray-500 text-sm md:text-base">Please enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        {/* USERNAME FIELD */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3 md:py-3.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all duration-200 text-base"
                                    placeholder="NRP / Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD FIELD */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-11 pr-4 py-3 md:py-3.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all duration-200 text-base"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* REMEMBER ME CHECKBOX */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4.5 w-4.5 text-rose-500 focus:ring-rose-400 border-gray-300 rounded cursor-pointer"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-700 cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3.5 md:py-4 px-4 rounded-xl shadow-md shadow-rose-100 text-sm md:text-base font-bold text-rose-900 bg-[#FFE4E1] hover:bg-[#ffccd5] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-200 transition-all duration-200 transform md:hover:-translate-y-0.5"
                        >
                            Sign In
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>

            {/* STACKED ALERT TOASTS */}
            <div className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-8 md:right-8 flex flex-col gap-3 items-center md:items-end z-[100]">
                {errors.map((error) => (
                    <div
                        key={error.id}
                        className={`w-full md:w-auto flex items-center bg-[#1a1a1a] text-white rounded-lg shadow-2xl overflow-hidden border-l-[6px] border-red-700 transition-all duration-300 ease-in-out transform ${
                            error.visible 
                                ? 'translate-y-0 opacity-100 scale-100' 
                                : 'translate-y-2 opacity-0 scale-95'
                        }`}
                    >
                        <div className="px-5 py-3.5 md:px-6 md:py-4 flex items-center justify-between gap-6 md:gap-12 w-full">
                            <span className="text-sm md:text-base font-normal tracking-wide leading-tight">{error.message}</span>
                            <button
                                onClick={() => {
                                    setErrors((prev) => prev.filter((err) => err.id !== error.id));
                                }}
                                className="text-gray-400 hover:text-white p-1 transition-colors flex-shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Login;