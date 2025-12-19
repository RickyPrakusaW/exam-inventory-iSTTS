import React, { useState } from 'react';
import { Database, Plus, Edit, Trash2, Building2, BookOpen, Users } from 'lucide-react';

const DataMaster = () => {
    const [activeTab, setActiveTab] = useState('prodi');

    const prodi = [
        { id: 1, name: 'Teknik Informatika', code: 'TI', jumlahMatkul: 24, jumlahMahasiswa: 1234 },
        { id: 2, name: 'Teknik Sipil', code: 'TS', jumlahMatkul: 18, jumlahMahasiswa: 856 },
        { id: 3, name: 'Teknik Industri', code: 'TIN', jumlahMatkul: 20, jumlahMahasiswa: 945 }
    ];

    const matkul = [
        { id: 1, name: 'Algoritma dan Pemrograman', code: 'ALPRO', prodi: 'Teknik Informatika', jumlahSoal: 45 },
        { id: 2, name: 'Basis Data', code: 'BASDAT', prodi: 'Teknik Informatika', jumlahSoal: 32 },
        { id: 3, name: 'Kalkulus', code: 'KALK', prodi: 'Teknik Sipil', jumlahSoal: 28 }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <Database className="text-rose-600" size={32} />
                        Data Master
                    </h1>
                    <p className="text-gray-500 text-lg">Kelola data program studi dan mata kuliah</p>
                </div>
                <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                    <Plus size={20} />
                    Tambah Data
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('prodi')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
                        activeTab === 'prodi'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Building2 size={18} />
                        Program Studi
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('matkul')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
                        activeTab === 'matkul'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} />
                        Mata Kuliah
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'prodi' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama Program Studi</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Mata Kuliah</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Mahasiswa</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {prodi.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.jumlahMatkul} mata kuliah</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Users size={14} />
                                                {item.jumlahMahasiswa}
                                            </div>
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
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama Mata Kuliah</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Program Studi</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Jumlah Soal</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {matkul.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                                {item.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.prodi}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.jumlahSoal} soal</td>
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
                )}
            </div>
        </div>
    );
};

export default DataMaster;

