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
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                        <Database className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                        <span>Data Master</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg">Kelola data program studi dan mata kuliah</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="md:inline">Tambah Data</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('prodi')}
                    className={`px-4 md:px-6 py-2.5 md:py-3 font-bold text-xs md:text-sm transition-colors border-b-2 shrink-0 ${
                        activeTab === 'prodi'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        <span>Program Studi</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('matkul')}
                    className={`px-4 md:px-6 py-2.5 md:py-3 font-bold text-xs md:text-sm transition-colors border-b-2 shrink-0 ${
                        activeTab === 'matkul'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        <span>Mata Kuliah</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'prodi' ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {prodi.map(item => (
                                <div key={item.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Mata Kuliah:</span>
                                            <span className="text-gray-900 font-medium">{item.jumlahMatkul} mata kuliah</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Mahasiswa:</span>
                                            <div className="flex items-center gap-1 text-gray-900 font-medium">
                                                <Users className="w-3.5 h-3.5" />
                                                {item.jumlahMahasiswa}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama Program Studi</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Mata Kuliah</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Mahasiswa</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {prodi.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <span className="px-2.5 md:px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-900 text-sm">{item.name}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{item.jumlahMatkul} mata kuliah</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {item.jumlahMahasiswa}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                    <button className="p-1.5 md:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {matkul.map(item => (
                                <div key={item.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Program Studi:</span>
                                            <span className="text-gray-900 font-medium">{item.prodi}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Jumlah Soal:</span>
                                            <span className="text-gray-900 font-medium">{item.jumlahSoal} soal</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama Mata Kuliah</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Program Studi</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Jumlah Soal</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {matkul.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <span className="px-2.5 md:px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-900 text-sm">{item.name}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{item.prodi}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{item.jumlahSoal} soal</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                    <button className="p-1.5 md:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DataMaster;

