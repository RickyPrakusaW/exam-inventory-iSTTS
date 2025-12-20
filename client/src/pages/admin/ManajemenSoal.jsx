import React, { useState } from 'react';
import { FileText, Search, Edit, Trash2, Download, Filter, Plus } from 'lucide-react';

const ManajemenSoal = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const soals = [
        {
            id: 1,
            namaMatkul: 'Algoritma dan Pemrograman',
            kodeMatkul: 'IF101',
            jenisUjian: 'UAS',
            semester: 'Ganjil',
            tahunAjaran: '2023/2024',
            dosenPengampu: 'Dr. Ahmad Wijaya, S.Kom., M.Kom.',
            programStudi: 'S1-Informatika',
            fakultas: 'Fakultas Teknologi Informasi',
            downloads: 456,
            status: 'Aktif'
        },
        {
            id: 2,
            namaMatkul: 'Basis Data',
            kodeMatkul: 'IF201',
            jenisUjian: 'UTS',
            semester: 'Genap',
            tahunAjaran: '2023/2024',
            dosenPengampu: 'Prof. Dr. Budi Santoso, S.Kom., M.T.',
            programStudi: 'S1-Informatika',
            fakultas: 'Fakultas Teknologi Informasi',
            downloads: 234,
            status: 'Aktif'
        },
        {
            id: 3,
            namaMatkul: 'Kalkulus',
            kodeMatkul: 'MT101',
            jenisUjian: 'UAS',
            semester: 'Ganjil',
            tahunAjaran: '2023/2024',
            dosenPengampu: 'Dr. Siti Nurhaliza, S.Si., M.Si.',
            programStudi: 'S1-Teknik Elektro',
            fakultas: 'Fakultas Teknik',
            downloads: 389,
            status: 'Aktif'
        },
        {
            id: 4,
            namaMatkul: 'Desain Grafis',
            kodeMatkul: 'DKV101',
            jenisUjian: 'UAS',
            semester: 'Ganjil',
            tahunAjaran: '2023/2024',
            dosenPengampu: 'Ahmad Fauzi, S.Ds., M.Ds.',
            programStudi: 'S1-Desain Komunikasi Visual',
            fakultas: 'Fakultas Desain',
            downloads: 312,
            status: 'Aktif'
        },
        {
            id: 5,
            namaMatkul: 'Sistem Informasi Manajemen',
            kodeMatkul: 'SIB201',
            jenisUjian: 'UTS',
            semester: 'Genap',
            tahunAjaran: '2023/2024',
            dosenPengampu: 'Dr. Rina Wati, S.Kom., M.M.',
            programStudi: 'S1-Sistem Informasi Bisnis',
            fakultas: 'Fakultas Bisnis',
            downloads: 278,
            status: 'Nonaktif'
        }
    ];

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                        <FileText className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                        <span>Manajemen Soal</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg">Kelola dan atur semua arsip soal dalam sistem</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="md:inline">Tambah Soal</span>
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                            type="text"
                            placeholder="Cari soal berdasarkan judul, mata kuliah..."
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base">
                                <option>Semua Status</option>
                                <option>Aktif</option>
                                <option>Nonaktif</option>
                            </select>
                            <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {soals.map(soal => (
                    <div key={soal.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base mb-1">{soal.namaMatkul}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                    <span className="font-medium text-rose-600">{soal.kodeMatkul}</span>
                                    <span>•</span>
                                    <span>{soal.jenisUjian}</span>
                                    <span>•</span>
                                    <span>{soal.semester}</span>
                                    <span>•</span>
                                    <span>{soal.tahunAjaran}</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Kode MK:</span>
                                    <span className="text-gray-900 font-medium">{soal.kodeMatkul}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Jenis Ujian:</span>
                                    <span className="text-gray-900 font-medium">{soal.jenisUjian}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Semester:</span>
                                    <span className="text-gray-900 font-medium">{soal.semester}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tahun Ajaran:</span>
                                    <span className="text-gray-900 font-medium">{soal.tahunAjaran}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Program Studi:</span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%]">{soal.programStudi}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Fakultas:</span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%]">{soal.fakultas}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Dosen Pengampu:</span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%]">{soal.dosenPengampu}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Unduhan:</span>
                                    <div className="flex items-center gap-1 text-gray-900 font-medium">
                                        <Download className="w-3 h-3" />
                                        {soal.downloads}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                        soal.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {soal.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
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
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mata Kuliah</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kode MK</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jenis Ujian</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Semester</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tahun Ajaran</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Program Studi</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Dosen</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unduhan</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {soals.map(soal => (
                                <tr key={soal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="font-bold text-gray-900 text-sm">{soal.namaMatkul}</div>
                                        <div className="text-xs text-gray-400 mt-1">{soal.fakultas}</div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <span className="font-medium text-rose-600 text-sm">{soal.kodeMatkul}</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">{soal.jenisUjian}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">{soal.semester}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">{soal.tahunAjaran}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 max-w-[200px]">{soal.programStudi}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 max-w-[200px]">{soal.dosenPengampu}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Download className="w-3.5 h-3.5" />
                                            {soal.downloads}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <span className={`px-2.5 md:px-3 py-1 text-xs font-bold rounded-full ${
                                            soal.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                        }`}>
                                            {soal.status}
                                        </span>
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
            </div>
        </div>
    );
};

export default ManajemenSoal;
