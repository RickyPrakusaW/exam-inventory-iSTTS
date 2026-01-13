import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import { AlertTriangle, Search, Eye, CheckCircle, XCircle, Clock, Filter, Edit } from 'lucide-react';
import SoalFormModal from '../../components/soal/SoalFormModal';

const LaporanMahasiswa = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Soal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // This will hold the SOAL object, not the report
    const [matkuls, setMatkuls] = useState([]);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/laporan');
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            }
        } catch (error) {
            console.error('Failed to fetch reports', error);
            showToast('Gagal memuat laporan', 'error');
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchReports();
        fetchMatkuls();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        const isConfirmed = await confirm({
            title: 'Konfirmasi',
            message: `Apakah Anda yakin ingin mengubah status laporan ini menjadi ${newStatus}?`,
            confirmText: 'Ya, Ubah',
            type: 'info'
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/laporan/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                showToast('Status laporan berhasil diperbarui', 'success');
                fetchReports();
            } else {
                showToast('Gagal memperbarui status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Terjadi kesalahan', 'error');
        }
    };

    // Edit Soal Handlers
    const handleEditSoal = (soal) => {
        if (!soal) {
             showToast('Data soal tidak ditemukan', 'error');
             return;
        }
        setSelectedItem(soal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleSaveSoal = async (formDataState) => {
        try {
            const formData = new FormData();
            formData.append('title', formDataState.title);
            formData.append('type', formDataState.type);
            formData.append('year', formDataState.year);
            formData.append('matkul_id', formDataState.matkul_id);
            // Default uploader_id to 1 (admin) for now, or keep existing? 
            // The backend might need uploader_id if it's a new file, but for edit strictly speaking we might want to preserve original uploader.
            // However, looking at ManajemenSoal, it hardcodes uploader_id to 1. Let's do same for consistency or maybe fetch current user if possible.
            // For now, hardcode 1 as 'Admin' is editing.
            formData.append('uploader_id', 1); 
            formData.append('status', formDataState.status);

            const selectedMatkul = matkuls.find(m => m.id == formDataState.matkul_id);
            if (selectedMatkul) {
                formData.append('matkul_name', selectedMatkul.name);
                formData.append('prodi_name', selectedMatkul.Prodi ? selectedMatkul.Prodi.name : 'Unknown');
                formData.append('prodi_code', selectedMatkul.Prodi ? selectedMatkul.Prodi.code : 'Unknown');
                formData.append('semester_num', selectedMatkul.semester);
            }

            if (formDataState.file) {
                formData.append('file', formDataState.file);
            }

            // We are ALWAYS editing here because we clicked "Edit Soal" on an existing soal
            if (!selectedItem || !selectedItem.id) {
                showToast('Error: No selected soal to update', 'error');
                return;
            }

            const url = `http://localhost:5000/api/soal/${selectedItem.id}`;
            const method = 'PUT';

            const response = await fetch(url, {
                method,
                body: formData
            });

            if (response.ok) {
                handleCloseModal();
                fetchReports(); // Refresh reports which might update Soal details shown? Actually Soal details in list might not update unless we refetch or they are from included model. 
                // Creating a separate fetchSoals isn't needed here as we view via Reports. 
                // But we should probably refresh reports to show updated Soal name if it changed.
                showToast('Soal berhasil diperbarui', 'success');
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


    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const doneCount = reports.filter(r => r.status === 'resolved').length;

    const filteredReports = reports.filter(item => {
        const matchesSearch = 
            item.User?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.User?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (statusFilter !== 'Semua Status') {
            if (statusFilter === 'Menunggu') matchesStatus = item.status === 'pending';
            if (statusFilter === 'Selesai') matchesStatus = item.status === 'resolved';
            if (statusFilter === 'Ditolak') matchesStatus = item.status === 'rejected';
        }

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full flex items-center gap-1"><Clock size={12} /> Menunggu</span>;
            case 'resolved':
                return <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={12} /> Selesai</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full flex items-center gap-1"><XCircle size={12} /> Ditolak</span>;
            default:
                return <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-full">{status}</span>;
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                    <AlertTriangle className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                    <span>Laporan Mahasiswa</span>
                </h1>
                <p className="text-gray-500 text-base md:text-lg">Kelola dan tanggapi laporan dari mahasiswa</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Menunggu</p>
                            <p className="text-2xl md:text-3xl font-black text-amber-600">{pendingCount}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-amber-50 rounded-xl">
                            <Clock className="text-amber-600 w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Ditolak</p>
                            <p className="text-2xl md:text-3xl font-black text-red-600">{reports.filter(r => r.status === 'rejected').length}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-red-50 rounded-xl">
                            <XCircle className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Selesai</p>
                            <p className="text-2xl md:text-3xl font-black text-green-600">{doneCount}</p>
                        </div>
                        <div className="p-2 md:p-3 bg-green-50 rounded-xl">
                            <CheckCircle className="text-green-600 w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama mahasiswa, NRP..."
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select 
                            className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>Semua Status</option>
                            <option>Menunggu</option>
                            <option>Selesai</option>
                            <option>Ditolak</option>
                        </select>
                        <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                    </div>
                </div>
            </div>

            {/* Laporan List */}
            <div className="space-y-4">
                {filteredReports.map(item => (
                    <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4 mb-4">
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                    <h3 className="font-bold text-gray-900 text-base md:text-lg">{item.User?.name || 'Unknown User'}</h3>
                                    <span className="text-xs text-gray-400">({item.User?.email})</span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500">
                                    {item.Soal?.name || 'Soal'} • {item.Soal?.Matkul?.name || 'Mata Kuliah'}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400 mt-2">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • 
                                    {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="shrink-0">
                                {getStatusBadge(item.status)}
                            </div>
                        </div>
                        <div className="space-y-2 pt-3 md:pt-4 border-t border-gray-50">
                            <div>
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Jenis Laporan:</span>
                                <p className="text-xs md:text-sm text-gray-800 font-medium mt-1">{item.jenis}</p>
                            </div>
                            <div>
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Deskripsi:</span>
                                <p className="text-xs md:text-sm text-gray-600 mt-1 leading-relaxed">{item.reason}</p>
                            </div>
                        </div>
                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-50 mt-4">
                            <button 
                                onClick={() => item.Soal?.file_url && window.open(item.Soal.file_url, '_blank')}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
                            >
                                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                Lihat Soal
                            </button>
                            
                            {/* NEW: Edit Button for Pending Reports */}
                            {item.status === 'pending' && (
                                <button 
                                    onClick={() => handleEditSoal(item.Soal)}
                                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-blue-100 transition-colors active:scale-95"
                                >
                                    <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    Edit Soal
                                </button>
                            )}

                            {item.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => handleUpdateStatus(item.id, 'resolved')}
                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-green-700 transition-colors active:scale-95"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        Selesai
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-red-200 transition-colors active:scale-95"
                                    >
                                        <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        Tolak
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <SoalFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSaveSoal}
                initialData={selectedItem}
                matkuls={matkuls}
            />
        </div>
    );
};

export default LaporanMahasiswa;

