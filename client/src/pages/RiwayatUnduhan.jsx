import React from 'react';
import { History, Download, FileText, Calendar, Clock } from 'lucide-react';

const RiwayatUnduhan = () => {
    const downloadHistory = [
        {
            id: 1,
            title: 'UAS Algoritma dan Pemrograman',
            prodi: 'Teknik Informatika',
            year: '2023',
            type: 'UAS',
            downloadDate: '20 Jan 2025',
            downloadTime: '14:30'
        },
        {
            id: 2,
            title: 'UTS Basis Data',
            prodi: 'Teknik Informatika',
            year: '2024',
            type: 'UTS',
            downloadDate: '18 Jan 2025',
            downloadTime: '10:15'
        },
        {
            id: 3,
            title: 'UAS Kalkulus',
            prodi: 'Teknik Sipil',
            year: '2023',
            type: 'UAS',
            downloadDate: '15 Jan 2025',
            downloadTime: '16:45'
        },
        {
            id: 4,
            title: 'UTS Pemrograman Web',
            prodi: 'Teknik Informatika',
            year: '2024',
            type: 'UTS',
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
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <FileText className="text-blue-600" size={24} />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.prodi} • {item.year} • {item.type}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
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
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors">
                                    <Download size={16} /> Unduh Lagi
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

