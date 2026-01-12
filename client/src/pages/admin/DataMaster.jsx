import React, { useState, useEffect } from 'react';
import { Database, Plus, Edit, Trash2, Building2, BookOpen, Users } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';

const DataMaster = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [activeTab, setActiveTab] = useState('prodi');

    const [prodi, setProdi] = useState([]);
    const [matkul, setMatkul] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [selectedItem, setSelectedItem] = useState(null);

    // Form States
    const [prodiForm, setProdiForm] = useState({ name: '', code: '', fakultas: '' });
    const [matkulForm, setMatkulForm] = useState({ name: '', code: '', semester: '', prodi_id: '' });

    const resetForms = () => {
        setProdiForm({ name: '', code: '', fakultas: '' });
        setMatkulForm({ name: '', code: '', semester: '', prodi_id: '' });
        setSelectedItem(null);
        setModalMode('create');
    };

    const handleOpenModal = (mode = 'create', item = null) => {
        setModalMode(mode);
        setSelectedItem(item);
        if (activeTab === 'prodi') {
            if (item) {
                setProdiForm({ name: item.name, code: item.code, fakultas: item.fakultas });
            } else {
                setProdiForm({ name: '', code: '', fakultas: '' });
            }
        } else {
            if (item) {
                setMatkulForm({ 
                    name: item.name, 
                    code: item.code, 
                    semester: item.semester, 
                    prodi_id: item.Prodi ? item.Prodi.id : (prodi.find(p => p.name === item.prodi)?.id || '') 
                });
            } else {
                setMatkulForm({ name: '', code: '', semester: '', prodi_id: '' });
            }
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForms();
    };


    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodiRes, matkulRes] = await Promise.all([
                fetch('http://localhost:5000/api/master/prodi'),
                fetch('http://localhost:5000/api/master/matkul')
            ]);

            if (prodiRes.ok) {
                const data = await prodiRes.json();
                setProdi(data);
            }
            
            if (matkulRes.ok) {
                const data = await matkulRes.json();
                // Map matkul data to match frontend requirements if needed, mainly 'prodi' name
                const formattedMatkul = data.map(m => ({
                    ...m,
                    prodi: m.Prodi ? m.Prodi.name : 'Unknown',
                    jumlahSoal: m.dataValues ? m.dataValues.jumlahSoal : m.jumlahSoal // Sequelize aggregate might be in dataValues or direct
                }));
                setMatkul(formattedMatkul);
            }
        } catch (error) {
            console.error('Failed to fetch master data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = activeTab === 'prodi' ? 'http://localhost:5000/api/master/prodi' : 'http://localhost:5000/api/master/matkul';
        const method = modalMode === 'create' ? 'POST' : 'PUT';
        const url = modalMode === 'create' ? endpoint : `${endpoint}/${selectedItem.id}`;
        const body = activeTab === 'prodi' ? prodiForm : matkulForm;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                handleCloseModal();
                fetchData();
            } else {
                showToast('Failed to save data', 'error');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            showToast('Error saving data', 'error');
        }
    };

    const handleDelete = async (id, type) => {
        const isConfirmed = await confirm({
            title: `Hapus ${type === 'prodi' ? 'Program Studi' : 'Mata Kuliah'}`,
            message: `Apakah Anda yakin ingin menghapus data ${type === 'prodi' ? 'program studi' : 'mata kuliah'} ini? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Hapus',
            type: 'danger'
        });

        if (!isConfirmed) return;

        const endpoint = type === 'prodi' ? 'http://localhost:5000/api/master/prodi' : 'http://localhost:5000/api/master/matkul';
        try {
            const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchData();
            } else {
                const data = await response.json();
                showToast(data.message || 'Failed to delete data', 'error');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            showToast('Error deleting data', 'error');
        }
    };


    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                        <Database className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                        <span>Data Master</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg">Kelola data program studi dan mata kuliah</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="md:inline">Tambah Data {activeTab === 'prodi' ? 'Prodi' : 'Matkul'}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('prodi')}
                    className={`px-4 md:px-6 py-2.5 md:py-3 font-bold text-xs md:text-sm transition-colors border-b-2 shrink-0 ${
                        activeTab === 'prodi'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        <span>Program Studi</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('matkul')}
                    className={`px-4 md:px-6 py-2.5 md:py-3 font-bold text-xs md:text-sm transition-colors border-b-2 shrink-0 ${
                        activeTab === 'matkul'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        <span>Mata Kuliah</span>
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'prodi' ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {prodi.map(item => (
                                <div key={item.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Mata Kuliah:</span>
                                            <span className="text-gray-900 font-medium">{item.jumlahMatkul} mata kuliah</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Mahasiswa:</span>
                                            <div className="flex items-center gap-1 text-gray-900 font-medium">
                                                <Users className="w-3.5 h-3.5" />
                                                {item.jumlahMahasiswa}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        <button 
                                            onClick={() => handleOpenModal('edit', item)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id, 'prodi')}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama Program Studi</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Mata Kuliah</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Mahasiswa</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {prodi.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <span className="px-2.5 md:px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-900 text-sm">{item.name}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{item.jumlahMatkul} mata kuliah</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {item.jumlahMahasiswa}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleOpenModal('edit', item)}
                                                        className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id, 'prodi')}
                                                        className="p-1.5 md:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {matkul.map(item => (
                                <div key={item.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Program Studi:</span>
                                            <span className="text-gray-900 font-medium">{item.prodi}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Jumlah Soal:</span>
                                            <span className="text-gray-900 font-medium">{item.jumlahSoal} soal</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        <button 
                                            onClick={() => handleOpenModal('edit', item)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id, 'matkul')}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Nama Mata Kuliah</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Program Studi</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Jumlah Soal</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {matkul.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <span className="px-2.5 md:px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                                    {item.code}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-900 text-sm">{item.name}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{item.prodi}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600">{item.jumlahSoal} soal</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleOpenModal('edit', item)}
                                                        className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id, 'matkul')}
                                                        className="p-1.5 md:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalMode === 'create' ? 'Tambah' : 'Edit'} {activeTab === 'prodi' ? 'Program Studi' : 'Mata Kuliah'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {activeTab === 'prodi' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program Studi</label>
                                        <input
                                            type="text"
                                            required
                                            value={prodiForm.name}
                                            onChange={(e) => setProdiForm({ ...prodiForm, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                            placeholder="Contoh: Informatika"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                                        <input
                                            type="text"
                                            required
                                            value={prodiForm.code}
                                            onChange={(e) => setProdiForm({ ...prodiForm, code: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                            placeholder="Contoh: IF"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fakultas</label>
                                        <input
                                            type="text"
                                            required
                                            value={prodiForm.fakultas}
                                            onChange={(e) => setProdiForm({ ...prodiForm, fakultas: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                            placeholder="Contoh: Fakultas Teknologi Informasi"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah</label>
                                        <input
                                            type="text"
                                            required
                                            value={matkulForm.name}
                                            onChange={(e) => setMatkulForm({ ...matkulForm, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                            placeholder="Contoh: Pemrograman Web"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                                        <input
                                            type="text"
                                            required
                                            value={matkulForm.code}
                                            onChange={(e) => setMatkulForm({ ...matkulForm, code: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                            placeholder="Contoh: IF-101"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                        <input
                                            type="number"
                                            required
                                            value={matkulForm.semester}
                                            onChange={(e) => setMatkulForm({ ...matkulForm, semester: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                            placeholder="Contoh: 1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                                        <select
                                            required
                                            value={matkulForm.prodi_id}
                                            onChange={(e) => setMatkulForm({ ...matkulForm, prodi_id: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            {prodi.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataMaster;

