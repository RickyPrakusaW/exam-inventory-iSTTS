import React, { useState } from 'react';
import { Search, Filter, Download, Bookmark, ThumbsUp, FileText } from 'lucide-react';

const PencarianSoal = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const hasilPencarian = [
        {
            id: 1,
            title: 'UAS Algoritma dan Pemrograman',
            prodi: 'Teknik Informatika',
            year: '2023',
            type: 'UAS',
            downloads: 456,
            likes: 89
        },
        {
            id: 2,
            title: 'UTS Basis Data',
            prodi: 'Teknik Informatika',
            year: '2024',
            type: 'UTS',
            downloads: 234,
            likes: 45
        },
        {
            id: 3,
            title: 'UAS Kalkulus',
            prodi: 'Teknik Sipil',
            year: '2023',
            type: 'UAS',
            downloads: 389,
            likes: 67
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Search className="text-rose-600" size={32} />
                    Pencarian Soal
                </h1>
                <p className="text-gray-500 text-lg">Cari dan temukan arsip soal yang Anda butuhkan</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari mata kuliah, program studi, atau kata kunci..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                                <option>Semua Jenis</option>
                                <option>UTS</option>
                                <option>UAS</option>
                                <option>Kuis</option>
                            </select>
                            <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-rose-100 transition-all active:scale-95">
                            <Search size={20} />
                            Cari
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Hasil Pencarian</h2>
                    <span className="text-sm text-gray-500">{hasilPencarian.length} hasil ditemukan</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {hasilPencarian.map(soal => (
                        <div key={soal.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{soal.title}</h3>
                                    <p className="text-sm text-gray-500">{soal.prodi} • {soal.year} • {soal.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors">
                                    <Download size={16} /> Unduh
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                    <Bookmark size={16} /> Simpan
                                </button>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <ThumbsUp size={16} /> {soal.likes}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Download size={16} /> {soal.downloads}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PencarianSoal;

