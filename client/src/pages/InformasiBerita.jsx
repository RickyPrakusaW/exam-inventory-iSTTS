import React from 'react';
import { Newspaper, Calendar, FileText } from 'lucide-react';

const InformasiBerita = () => {
    const berita = [
        {
            id: 1,
            title: 'Jadwal UTS 2025 Dipindah',
            desc: 'UTS yang semula dijadwalkan tanggal 20 Maret dipindah ke tanggal 28 Maret 2025.',
            date: '15 Jan 2025',
            type: 'Pengumuman',
            color: 'blue'
        },
        {
            id: 2,
            title: 'Perpanjangan Waktu Upload',
            desc: 'Waktu upload soal diperpanjang hingga 15 April 2025.',
            date: '10 Jan 2025',
            type: 'Informasi',
            color: 'amber'
        },
        {
            id: 3,
            title: 'Panduan Penggunaan Bank Soal',
            desc: 'Panduan lengkap penggunaan sistem bank soal untuk mahasiswa tersedia di halaman bantuan.',
            date: '5 Jan 2025',
            type: 'Panduan',
            color: 'green'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Newspaper className="text-rose-600" size={32} />
                    Informasi & Berita
                </h1>
                <p className="text-gray-500 text-lg">Dapatkan informasi terbaru dan pengumuman penting</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {berita.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all ${
                            item.color === 'blue' ? 'border-blue-500' : 
                            item.color === 'amber' ? 'border-amber-500' : 
                            'border-green-500'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-gray-400" />
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                                        item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                                        item.color === 'amber' ? 'bg-amber-50 text-amber-600' : 
                                        'bg-green-50 text-green-600'
                                    }`}>
                                        {item.type}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                                    <Calendar size={14} />
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InformasiBerita;

