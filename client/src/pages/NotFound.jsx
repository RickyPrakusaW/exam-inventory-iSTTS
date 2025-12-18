import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
            <div className="relative w-full max-w-2xl text-center">
                {/* Latar Belakang Dekoratif (Soft Blobs) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-rose-100 rounded-full blur-[100px] opacity-60 z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[250px] h-[250px] bg-blue-100 rounded-full blur-[100px] opacity-60 z-0"></div>

                <div className="relative z-10 space-y-8">
                    {/* Visual Element */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="bg-white p-6 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Search size={64} className="text-gray-200" />
                            </div>
                            <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                                Oops!
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Halaman Hilang dari Jangkauan
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                            Maaf, sepertinya rute <code className="bg-gray-100 px-2 py-0.5 rounded text-rose-500 font-mono text-sm">{location.pathname}</code> tidak ada dalam arsip kami atau telah dipindahkan.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to={-1}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all active:scale-95"
                        >
                            <ArrowLeft size={20} />
                            Kembali
                        </Link>
                        <Link
                            to="/"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
                        >
                            <Home size={20} />
                            Ke Beranda
                        </Link>
                    </div>

                    {/* Footer / Helper */}
                    <p className="text-xs text-gray-400 pt-8 uppercase tracking-widest font-semibold">
                        Sistem Bank Soal iSTTS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
