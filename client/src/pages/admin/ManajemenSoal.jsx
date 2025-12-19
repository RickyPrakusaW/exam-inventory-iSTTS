import React, { useState } from 'react';
import { FileText, Search, Upload, Edit, Trash2, Download, Filter, Plus } from 'lucide-react';

const ManajemenSoal = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const soals = [
        {
            id: 1,
            title: 'UAS Algoritma dan Pemrograman',
            matkul: 'Algoritma dan Pemrograman',
            prodi: 'Teknik Informatika',
            year: '2023',
            type: 'UAS',
            downloads: 456,
            status: 'Aktif'
        },
        {
            id: 2,
            title: 'UTS Basis Data',
            matkul: 'Basis Data',
            prodi: 'Teknik Informatika',
            year: '2024',
            type: 'UTS',
            downloads: 234,
            status: 'Aktif'
        },
        {
            id: 3,
            title: 'UAS Kalkulus',
            matkul: 'Kalkulus',
            prodi: 'Teknik Sipil',
            year: '2023',
            type: 'UAS',
            downloads: 389,
            status: 'Aktif'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <FileText className="text-rose-600" size={32} />
                        Manajemen Soal
                    </h1>
                    <p className="text-gray-500 text-lg">Kelola dan atur semua arsip soal dalam sistem</p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                    <Plus size={20} />
                    Tambah Soal
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari soal berdasarkan judul, mata kuliah, atau program studi..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                                <option>Semua Status</option>
                                <option>Aktif</option>
                                <option>Nonaktif</option>
                            </select>
                            <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="md:hidden px-4 py-3 bg-rose-600 text-white font-bold rounded-xl">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table/List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Judul Soal</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mata Kuliah</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Program Studi</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tahun</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unduhan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {soals.map(soal => (
                                <tr key={soal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{soal.title}</div>
                                        <div className="text-xs text-gray-400 mt-1">{soal.type}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{soal.matkul}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{soal.prodi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{soal.year}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Download size={14} />
                                            {soal.downloads}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
                                            {soal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManajemenSoal;
