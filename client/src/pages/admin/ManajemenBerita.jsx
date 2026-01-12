import React, { useState, useEffect } from 'react';
import { Newspaper, Filter, Plus } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import BeritaCard from '../../components/berita/BeritaCard';
import BeritaFormModal from '../../components/berita/BeritaFormModal';
import { getBerita, createBerita, updateBerita, deleteBerita } from '../../services/beritaService';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';

const ManajemenBerita = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('Semua Jenis');
    
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchBerita = async () => {
        try {
            setLoading(true);
            const data = await getBerita();
            setBerita(data);
        } catch (error) {
            showToast('Gagal memuat berita', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBerita();
    }, []);

    const handleOpenModal = (item = null) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedItem) {
                await updateBerita(selectedItem.id, formData);
                showToast('Berita berhasil diperbarui', 'success');
            } else {
                await createBerita(formData);
                showToast('Berita berhasil ditambahkan', 'success');
            }
            fetchBerita();
            handleCloseModal();
        } catch (error) {
            showToast('Gagal menyimpan berita', 'error');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Hapus Berita',
            message: 'Apakah Anda yakin ingin menghapus berita ini secara permanen?',
            confirmText: 'Hapus',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            await deleteBerita(id);
            showToast('Berita berhasil dihapus', 'success');
            fetchBerita();
        } catch (error) {
            showToast('Gagal menghapus berita', 'error');
        }
    };

    const filteredBerita = berita.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'Semua Jenis' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <PageHeader
                title="Manajemen Berita"
                subtitle="Kelola pengumuman dan informasi untuk mahasiswa"
                icon={Newspaper}
                buttonText="Tambah Berita"
                onButtonClick={() => handleOpenModal(null)}
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
                            <select 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                            >
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
            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data...</div>
            ) : filteredBerita.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Tidak ada berita ditemukan.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredBerita.map(item => (
                        <BeritaCard 
                            key={item.id} 
                            item={item} 
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <BeritaFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={selectedItem}
            />
        </div>
    );
};

export default ManajemenBerita;

