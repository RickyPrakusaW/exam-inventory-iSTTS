import React from 'react';
import { Bookmark, Download, Trash2, FileText, Calendar } from 'lucide-react';

const PerpustakaanPribadi = () => {
    const savedSoals = [
        {
            id: 1,
            title: 'UAS Algoritma dan Pemrograman',
            prodi: 'Teknik Informatika',
            year: '2023',
            type: 'UAS',
            savedDate: '15 Jan 2025'
        },
        {
            id: 2,
            title: 'UTS Basis Data',
            prodi: 'Teknik Informatika',
            year: '2024',
            type: 'UTS',
            savedDate: '12 Jan 2025'
        },
        {
            id: 3,
            title: 'UAS Kalkulus',
            prodi: 'Teknik Sipil',
            year: '2023',
            type: 'UAS',
            savedDate: '10 Jan 2025'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Bookmark className="text-rose-600" size={32} />
                    Perpustakaan Pribadi
                </h1>
                <p className="text-gray-500 text-lg">Soal-soal yang telah Anda simpan untuk referensi belajar</p>
            </div>

            {savedSoals.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <Bookmark size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Soal Tersimpan</h3>
                    <p className="text-gray-500">Mulai simpan soal favorit Anda untuk akses cepat di kemudian hari</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {savedSoals.map(soal => (
                        <div key={soal.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-rose-50 rounded-xl">
                                        <FileText className="text-rose-600" size={24} />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{soal.title}</h3>
                                        <p className="text-sm text-gray-500">{soal.prodi} • {soal.year} • {soal.type}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                                            <Calendar size={14} />
                                            <span>Disimpan: {soal.savedDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors">
                                    <Download size={16} /> Unduh
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors">
                                    <Trash2 size={16} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PerpustakaanPribadi;

