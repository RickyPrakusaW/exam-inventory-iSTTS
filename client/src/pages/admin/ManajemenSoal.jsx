import React, { useState, useEffect } from 'react';
import { FileText, Filter } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import SoalCard from '../../components/soal/SoalCard';
import SoalTable from '../../components/soal/SoalTable';
import SoalFormModal from '../../components/soal/SoalFormModal';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';

const ManajemenSoal = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');

    const [soals, setSoals] = useState([]);
    const [matkuls, setMatkuls] = useState([]); // Need matkuls for dropdown
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Helper to get matkul list
    const fetchMatkuls = async () => {
         try {
             const response = await fetch('http://localhost:5000/api/master/matkul');
             if (response.ok) {
                 const data = await response.json();
                 setMatkuls(data);
             }
         } catch (error) {
             console.error("Failed to fetch matkuls", error);
         }
    };

    const fetchSoals = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/soal');
            if (response.ok) {
                const data = await response.json();
                setSoals(data);
            }
        } catch (error) {
            console.error('Failed to fetch soals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoals();
        fetchMatkuls();
    }, []);

    const handleOpenModal = (item = null) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleSubmit = async (formDataState) => {
        try {
            const formData = new FormData();
            formData.append('title', formDataState.title);
            formData.append('type', formDataState.type);
            formData.append('year', formDataState.year);
            formData.append('matkul_id', formDataState.matkul_id);
            // Default uploader_id to 1 (admin) for now
            formData.append('uploader_id', 1); 
            formData.append('status', formDataState.status);
            if (formDataState.file) {
                formData.append('file', formDataState.file);
            }

            const url = selectedItem 
                ? `http://localhost:5000/api/soal/${selectedItem.id}` 
                : 'http://localhost:5000/api/soal';
            
            const method = selectedItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData
            });

            if (response.ok) {
                handleCloseModal();
                fetchSoals();
                showToast('Soal berhasil disimpan', 'success');
            } else {
                let errorMessage = 'Failed to save soal';
                try {
                    const err = await response.json();
                    errorMessage = err.message || errorMessage;
                } catch (e) {
                    console.error("Non-JSON error response", e);
                    errorMessage = 'Terjadi kesalahan pada server';
                }
                showToast(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error saving soal:', error);
            showToast('Error saving soal', 'error');
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Hapus Soal',
            message: 'Apakah Anda yakin ingin menghapus arsip soal ini secara permanen?',
            confirmText: 'Hapus',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/soal/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchSoals();
            } else {
                showToast('Failed to delete soal', 'error');
            }
        } catch (error) {
            console.error('Error deleting soal:', error);
        }
    };

    const filteredSoals = soals.filter(soal => 
        (statusFilter === 'Semua Status' || soal.status === statusFilter) &&
        (soal.namaMatkul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        soal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        soal.kodeMatkul?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <PageHeader 
                title="Manajemen Soal" 
                subtitle="Kelola dan atur semua arsip soal dalam sistem"
                icon={FileText}
                buttonText="Tambah Soal"
                onButtonClick={() => handleOpenModal(null)}
            />

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1">
                        <SearchInput 
                            placeholder="Cari soal berdasarkan judul, mata kuliah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                            >
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
                {filteredSoals.map(soal => (
                    <SoalCard 
                        key={soal.id} 
                        soal={soal} 
                        onEdit={handleOpenModal} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>

            {/* Desktop Table View */}
            <SoalTable 
                soals={filteredSoals} 
                onEdit={handleOpenModal} 
                onDelete={handleDelete} 
            />
            
            {/* Modal */}
            <SoalFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={selectedItem}
                matkuls={matkuls}
            />
        </div>
    );
};

export default ManajemenSoal;
