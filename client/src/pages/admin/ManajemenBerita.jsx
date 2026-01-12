import React, { useState } from 'react';
import { Newspaper, Filter } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import BeritaCard from '../../components/berita/BeritaCard';

const ManajemenBerita = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const berita = [
        {
            id: 1,
            title: 'Jadwal UTS 2025 Dipindah',
            desc: 'UTS yang semula dijadwalkan tanggal 20 Maret dipindah ke tanggal 28 Maret 2025.',
            type: 'Pengumuman',
            startDate: '15 Jan 2025',
            endDate: '28 Mar 2025',
            views: 1234,
            status: 'Aktif'
        },
        {
            id: 2,
            title: 'Perpanjangan Waktu Upload',
            desc: 'Waktu upload soal diperpanjang hingga 15 April 2025.',
            type: 'Informasi',
            startDate: '10 Jan 2025',
            endDate: '15 Apr 2025',
            views: 856,
            status: 'Aktif'
        },
        {
            id: 3,
            title: 'Panduan Penggunaan Bank Soal',
            desc: 'Panduan lengkap penggunaan sistem bank soal untuk mahasiswa.',
            type: 'Panduan',
            startDate: '5 Jan 2025',
            endDate: '31 Des 2025',
            views: 2341,
            status: 'Aktif'
        }
    ];

    const filteredBerita = berita.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <PageHeader
                title="Manajemen Berita"
                subtitle="Kelola pengumuman dan informasi untuk mahasiswa"
                icon={Newspaper}
                buttonText="Tambah Berita"
                onButtonClick={() => console.log('Add news')}
            />

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1">
                        <SearchInput
                            placeholder="Cari berita berdasarkan judul atau jenis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base">
                                <option>Semua Jenis</option>
                                <option>Pengumuman</option>
                                <option>Informasi</option>
                                <option>Panduan</option>
                            </select>
                            <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Berita List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredBerita.map(item => (
                    <BeritaCard 
                        key={item.id} 
                        item={item} 
                        onEdit={(item) => console.log('Edit', item)}
                        onDelete={(id) => console.log('Delete', id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ManajemenBerita;

