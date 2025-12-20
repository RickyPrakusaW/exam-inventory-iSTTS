import React from 'react';
import { History, Download, FileText, Calendar, Clock } from 'lucide-react';

const RiwayatUnduhan = () => {
    const downloadHistory = [
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
            downloadDate: '20 Jan 2025',
            downloadTime: '14:30'
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
            downloadDate: '18 Jan 2025',
            downloadTime: '10:15'
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
            downloadDate: '15 Jan 2025',
            downloadTime: '16:45'
        },
        {
            id: 4,
            namaMatkul: 'Pemrograman Web',
            kodeMatkul: 'IF301',
            jenisUjian: 'UTS',
            semester: 'Genap',
            tahunAjaran: '2023/2024',
            dosenPengampu: 'Dr. Rudi Hartono, S.Kom., M.T.',
            programStudi: 'S1-Informatika',
            fakultas: 'Fakultas Teknologi Informasi',
            downloadDate: '12 Jan 2025',
            downloadTime: '09:20'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <History className="text-rose-600" size={32} />
                    Riwayat Unduhan
                </h1>
                <p className="text-gray-500 text-lg">Daftar semua soal yang telah Anda unduh</p>
            </div>

            {downloadHistory.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <Download size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Riwayat Unduhan</h3>
                    <p className="text-gray-500">Mulai unduh soal untuk melihat riwayat di sini</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {downloadHistory.map(item => (
                        <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="mb-4 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight mb-1">
                                            {item.namaMatkul}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                                            <span className="font-medium text-rose-600">{item.kodeMatkul}</span>
                                            <span>•</span>
                                            <span>{item.jenisUjian}</span>
                                            <span>•</span>
                                            <span>{item.semester}</span>
                                            <span>•</span>
                                            <span>{item.tahunAjaran}</span>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full whitespace-nowrap">
                                        {item.jenisUjian}
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-xs md:text-sm">
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        <div>
                                            <span className="text-gray-500">Program Studi:</span>
                                            <span className="text-gray-900 font-medium ml-1">{item.programStudi}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Fakultas:</span>
                                            <span className="text-gray-900 font-medium ml-1">{item.fakultas}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Dosen Pengampu:</span>
                                        <span className="text-gray-900 font-medium ml-1">{item.dosenPengampu}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-gray-400 pt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {item.downloadDate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {item.downloadTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 pt-4 border-t border-gray-50">
                                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95">
                                    <Download size={14} className="md:w-4 md:h-4" /> 
                                    <span>Unduh Lagi</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiwayatUnduhan;

