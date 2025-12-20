import React, { useState } from 'react';
import { Newspaper, Calendar, FileText, Search, Filter } from 'lucide-react';

const InformasiBerita = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const allBerita = [
        {
            id: 1,
            title: 'Jadwal UTS 2025 Dipindah',
            desc: 'UTS yang semula dijadwalkan tanggal 20 Maret dipindah ke tanggal 28 Maret 2025.',
            date: '15 Jan 2025',
            year: 2025,
            month: 1,
            type: 'Pengumuman',
            color: 'blue'
        },
        {
            id: 2,
            title: 'Perpanjangan Waktu Upload',
            desc: 'Waktu upload soal diperpanjang hingga 15 April 2025.',
            date: '10 Jan 2025',
            year: 2025,
            month: 1,
            type: 'Informasi',
            color: 'amber'
        },
        {
            id: 3,
            title: 'Panduan Penggunaan Bank Soal',
            desc: 'Panduan lengkap penggunaan sistem bank soal untuk mahasiswa tersedia di halaman bantuan.',
            date: '5 Jan 2025',
            year: 2025,
            month: 1,
            type: 'Panduan',
            color: 'green'
        },
        {
            id: 4,
            title: 'Pengumuman Ujian Semester Genap',
            desc: 'Ujian semester genap akan dilaksanakan mulai tanggal 15 Juni 2025.',
            date: '20 Mar 2025',
            year: 2025,
            month: 3,
            type: 'Pengumuman',
            color: 'blue'
        },
        {
            id: 5,
            title: 'Update Sistem Bank Soal',
            desc: 'Sistem bank soal telah diperbarui dengan fitur pencarian yang lebih baik.',
            date: '12 Feb 2025',
            year: 2025,
            month: 2,
            type: 'Informasi',
            color: 'amber'
        },
        {
            id: 6,
            title: 'Jadwal UAS Semester Genap 2024',
            desc: 'Ujian Akhir Semester akan dilaksanakan pada bulan Desember 2024.',
            date: '15 Des 2024',
            year: 2024,
            month: 12,
            type: 'Pengumuman',
            color: 'blue'
        }
    ];

    // Get unique years from berita
    const years = [...new Set(allBerita.map(item => item.year))].sort((a, b) => b - a);
    
    // Month options
    const months = [
        { value: '', label: 'Semua Bulan' },
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' }
    ];

    // Filter berita
    const filteredBerita = allBerita.filter(item => {
        const matchesSearch = searchTerm === '' || 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesYear = selectedYear === '' || item.year === parseInt(selectedYear);
        const matchesMonth = selectedMonth === '' || item.month === parseInt(selectedMonth);
        
        return matchesSearch && matchesYear && matchesMonth;
    });

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                    <Newspaper className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                    <span>Informasi & Berita</span>
                </h1>
                <p className="text-gray-500 text-base md:text-lg">Dapatkan informasi terbaru dan pengumuman penting</p>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                            type="text"
                            placeholder="Cari berita berdasarkan judul, deskripsi, atau jenis..."
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <select
                                className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Semua Tahun</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <Calendar className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                        <div className="relative flex-1">
                            <select
                                className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                    </div>
                </div>
                {(searchTerm || selectedYear || selectedMonth) && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs md:text-sm text-gray-500 pt-2 border-t border-gray-100">
                        <span>Menampilkan {filteredBerita.length} dari {allBerita.length} berita</span>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedYear('');
                                setSelectedMonth('');
                            }}
                            className="text-rose-600 hover:text-rose-700 font-bold text-left sm:text-right active:scale-95 transition-all"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            {filteredBerita.length === 0 ? (
                <div className="bg-white p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 text-center">
                    <Newspaper className="mx-auto mb-4 text-gray-300 w-12 h-12 md:w-16 md:h-16" />
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Tidak Ada Berita Ditemukan</h3>
                    <p className="text-sm md:text-base text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {filteredBerita.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all ${
                                item.color === 'blue' ? 'border-blue-500' : 
                                item.color === 'amber' ? 'border-amber-500' : 
                                'border-green-500'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                        <FileText className="text-gray-400 shrink-0 w-4 h-4 md:w-5 md:h-5" />
                                        <span className={`text-[10px] md:text-xs font-bold uppercase px-2 py-1 rounded ${
                                            item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                                            item.color === 'amber' ? 'bg-amber-50 text-amber-600' : 
                                            'bg-green-50 text-green-600'
                                        }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-base md:text-lg leading-tight">{item.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 pt-1 md:pt-2">
                                        <Calendar className="w-3 h-3 md:w-[14px] md:h-[14px]" />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InformasiBerita;

