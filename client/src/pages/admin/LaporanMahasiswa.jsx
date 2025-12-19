import React, { useState } from 'react';
import { AlertTriangle, Search, Eye, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const LaporanMahasiswa = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const laporan = [
        {
            id: 1,
            mahasiswa: 'John Doe',
            nrp: '222222222',
            prodi: 'Teknik Informatika',
            jenis: 'Soal Tidak Sesuai',
            deskripsi: 'Soal UAS Algoritma memiliki jawaban yang salah pada nomor 5',
            status: 'Menunggu',
            tanggal: '20 Jan 2025',
            waktu: '14:30'
        },
        {
            id: 2,
            mahasiswa: 'Jane Smith',
            nrp: '222222223',
            prodi: 'Teknik Informatika',
            jenis: 'Soal Rusak',
            deskripsi: 'File PDF tidak dapat dibuka atau corrupt',
            status: 'Diproses',
            tanggal: '19 Jan 2025',
            waktu: '10:15'
        },
        {
            id: 3,
            mahasiswa: 'Bob Johnson',
            nrp: '222222224',
            prodi: 'Teknik Sipil',
            jenis: 'Soal Tidak Lengkap',
            deskripsi: 'Halaman 3 dari soal UTS Kalkulus hilang',
            status: 'Selesai',
            tanggal: '18 Jan 2025',
            waktu: '16:45'
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Menunggu':
                return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full flex items-center gap-1"><Clock size={12} /> {status}</span>;
            case 'Diproses':
                return <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full flex items-center gap-1"><Clock size={12} /> {status}</span>;
            case 'Selesai':
                return <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={12} /> {status}</span>;
            default:
                return <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-full">{status}</span>;
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <AlertTriangle className="text-rose-600" size={32} />
                    Laporan Mahasiswa
                </h1>
                <p className="text-gray-500 text-lg">Kelola dan tanggapi laporan dari mahasiswa</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Menunggu</p>
                            <p className="text-3xl font-black text-amber-600">12</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <Clock className="text-amber-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Diproses</p>
                            <p className="text-3xl font-black text-blue-600">8</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Selesai</p>
                            <p className="text-3xl font-black text-green-600">45</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama mahasiswa, NRP, atau jenis laporan..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                            <option>Semua Status</option>
                            <option>Menunggu</option>
                            <option>Diproses</option>
                            <option>Selesai</option>
                        </select>
                        <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Laporan List */}
            <div className="space-y-4">
                {laporan.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900 text-lg">{item.mahasiswa}</h3>
                                    <span className="text-xs text-gray-400">({item.nrp})</span>
                                </div>
                                <p className="text-sm text-gray-500">{item.prodi}</p>
                                <p className="text-xs text-gray-400 mt-2">{item.tanggal} • {item.waktu}</p>
                            </div>
                            {getStatusBadge(item.status)}
                        </div>
                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Jenis Laporan:</span>
                                <p className="text-sm text-gray-800 font-medium mt-1">{item.jenis}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Deskripsi:</span>
                                <p className="text-sm text-gray-600 mt-1">{item.deskripsi}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors">
                                <Eye size={16} />
                                Lihat Detail
                            </button>
                            {item.status === 'Menunggu' && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors">
                                    <CheckCircle size={16} />
                                    Terima
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LaporanMahasiswa;

