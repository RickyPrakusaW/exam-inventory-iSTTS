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
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                        <Newspaper className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                        <span>Manajemen Berita</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg">Kelola pengumuman dan informasi untuk mahasiswa</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="md:inline">Tambah Berita</span>
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                            type="text"
                            placeholder="Cari berita berdasarkan judul atau jenis..."
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base">
                                <option>Semua Jenis</option>
                                <option>Pengumuman</option>
                                <option>Informasi</option>
                                <option>Panduan</option>
                            </select>
                            <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Berita List */}
            <div className="grid grid-cols-1 gap-4">
                {berita.map(item => (
                    <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4 mb-4">
                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                    <span className={`px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-full ${
                                        item.type === 'Pengumuman' ? 'bg-blue-50 text-blue-600' :
                                        item.type === 'Informasi' ? 'bg-amber-50 text-amber-600' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className={`px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-full ${
                                        item.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight">{item.title}</h3>
                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-[10px] md:text-xs text-gray-400 pt-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 md:w-[14px] md:h-[14px]" />
                                        {item.startDate} - {item.endDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3 md:w-[14px] md:h-[14px]" />
                                        {item.views} dilihat
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-50">
                            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors active:scale-95">
                                <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                Edit
                            </button>
                            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95">
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
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

