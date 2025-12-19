import React, { useState } from 'react';
import { Newspaper, Plus, Edit, Trash2, Search, Calendar, Eye, Filter } from 'lucide-react';

const ManajemenBerita = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const berita = [
        {
            id: 1,
            title: 'Jadwal UTS 2025 Dipindah',
            desc: 'UTS yang semula dijadwalkan tanggal 20 Maret dipindah ke tanggal 28 Maret 2025.',
            type: 'Pengumuman',
            startDate: '15 Jan 2025',
            endDate: '28 Mar 2025',
            views: 1234,
            status: 'Aktif'
        },
        {
            id: 2,
            title: 'Perpanjangan Waktu Upload',
            desc: 'Waktu upload soal diperpanjang hingga 15 April 2025.',
            type: 'Informasi',
            startDate: '10 Jan 2025',
            endDate: '15 Apr 2025',
            views: 856,
            status: 'Aktif'
        },
        {
            id: 3,
            title: 'Panduan Penggunaan Bank Soal',
            desc: 'Panduan lengkap penggunaan sistem bank soal untuk mahasiswa.',
            type: 'Panduan',
            startDate: '5 Jan 2025',
            endDate: '31 Des 2025',
            views: 2341,
            status: 'Aktif'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <Newspaper className="text-rose-600" size={32} />
                        Manajemen Berita
                    </h1>
                    <p className="text-gray-500 text-lg">Kelola pengumuman dan informasi untuk mahasiswa</p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                    <Plus size={20} />
                    Tambah Berita
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari berita berdasarkan judul atau jenis..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                                <option>Semua Jenis</option>
                                <option>Pengumuman</option>
                                <option>Informasi</option>
                                <option>Panduan</option>
                            </select>
                            <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="md:hidden px-4 py-3 bg-rose-600 text-white font-bold rounded-xl">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Berita List */}
            <div className="grid grid-cols-1 gap-4">
                {berita.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        item.type === 'Pengumuman' ? 'bg-blue-50 text-blue-600' :
                                        item.type === 'Informasi' ? 'bg-amber-50 text-amber-600' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        item.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {item.startDate} - {item.endDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye size={14} />
                                        {item.views} dilihat
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors">
                                <Edit size={16} />
                                Edit
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors">
                                <Trash2 size={16} />
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManajemenBerita;

