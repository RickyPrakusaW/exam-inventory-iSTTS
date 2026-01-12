import React, { useState, useEffect } from 'react';
import { FileText, Search, Edit, Trash2, Download, Filter, Plus } from 'lucide-react';

const ManajemenSoal = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [soals, setSoals] = useState([]);
    const [matkuls, setMatkuls] = useState([]); // Need matkuls for dropdown
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [selectedItem, setSelectedItem] = useState(null);
    const [soalForm, setSoalForm] = useState({ 
        title: '', 
        type: 'UTS', 
        year: new Date().getFullYear(), 
        matkul_id: '', 
        status: 'Aktif',
        file: null
    });
    
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

    const handleOpenModal = (mode = 'create', item = null) => {
        setModalMode(mode);
        setSelectedItem(item);
        if (item) {
             // Find matkul_id from matkul code or name if needed, but item has details.
             // item from getAllSoal has `namaMatkul`, `kodeMatkul`.
             // We need actual ID. `getAllSoal` in controller doesn't seem to return `matkul_id` directly in formatted object?
             // Let's check `soalController.js`: `getAllSoal` returns `formattedSoals`.
             // It maps: id, namaMatkul, kodeMatkul... but NOT `matkul_id`.
             // I need to update `soalController.js` to return `matkul_id` OR derive it here.
             // Deriving is risky if names are not unique.
             // I MUST update `soalController.js` to return `matkul_id` and `title` (Wait, `title` was missing in `getAllSoal` formatted output too? `createSoal` accepts `title`, but `getAllSoal` uses `Matkul` name for display?)
             // `createSoal` accepts `title`, but `getAllSoal` doesn't seem to show it in the formatted list explicitly?
             // It shows `namaMatkul`.
             // Let's assume the user wants to set the Title of the Soal document separately from Matkul name?
             // In `soalController.js`: `const { title ... } = req.body`.
             // In `getAllSoal`: `formattedSoals` ... NO TITLE field returned!
             // This is a bug/deficiency in `getAllSoal`. I should fix it.
             
             // For now, I will proceed assuming I will fix `soalController` via another tool call immediately after.
             // I will assume `item.matkul_id` and `item.title` will be available.
             
            setSoalForm({
                title: item.title || '',
                type: item.jenisUjian || 'UTS',
                year: parseInt(item.tahunAjaran?.split('/')[0]) || new Date().getFullYear(),
                matkul_id: item.matkul_id || '', // Need to ensure this exists
                status: item.status || 'Aktif',
                file: null
            });
        } else {
            setSoalForm({ 
                title: '', 
                type: 'UTS', 
                year: new Date().getFullYear(), 
                matkul_id: '', 
                status: 'Aktif',
                file: null
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSoalForm({ title: '', type: 'UTS', year: new Date().getFullYear(), matkul_id: '', status: 'Aktif', file: null });
        setSelectedItem(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('title', soalForm.title);
            formData.append('type', soalForm.type);
            formData.append('year', soalForm.year);
            formData.append('matkul_id', soalForm.matkul_id);
            // Default uploader_id to 1 (admin) for now as auth is not fully passed to frontend context yet or handled by backend?
            // backend `createSoal` expects `uploader_id`.
            formData.append('uploader_id', 1); 
            formData.append('status', soalForm.status);
            if (soalForm.file) {
                formData.append('file', soalForm.file);
            }

            const url = modalMode === 'create' 
                ? 'http://localhost:5000/api/soal' 
                : `http://localhost:5000/api/soal/${selectedItem.id}`;
            
            const method = modalMode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                body: formData // No Content-Type header when using FormData
            });

            if (response.ok) {
                handleCloseModal();
                fetchSoals();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to save soal');
            }
        } catch (error) {
            console.error('Error saving soal:', error);
            alert('Error saving soal');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this soal?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/soal/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchSoals();
            } else {
                alert('Failed to delete soal');
            }
        } catch (error) {
            console.error('Error deleting soal:', error);
        }
    };



    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                        <FileText className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                        <span>Manajemen Soal</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg">Kelola dan atur semua arsip soal dalam sistem</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95">
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="md:inline">Tambah Soal</span>
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                            type="text"
                            placeholder="Cari soal berdasarkan judul, mata kuliah..."
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base">
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
                {soals.map(soal => (
                    <div key={soal.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base mb-1">{soal.namaMatkul}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                    <span className="font-medium text-rose-600">{soal.kodeMatkul}</span>
                                    <span>•</span>
                                    <span>{soal.jenisUjian}</span>
                                    <span>•</span>
                                    <span>{soal.semester}</span>
                                    <span>•</span>
                                    <span>{soal.tahunAjaran}</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Kode MK:</span>
                                    <span className="text-gray-900 font-medium">{soal.kodeMatkul}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Jenis Ujian:</span>
                                    <span className="text-gray-900 font-medium">{soal.jenisUjian}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Semester:</span>
                                    <span className="text-gray-900 font-medium">{soal.semester}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tahun Ajaran:</span>
                                    <span className="text-gray-900 font-medium">{soal.tahunAjaran}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Program Studi:</span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%]">{soal.programStudi}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Fakultas:</span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%]">{soal.fakultas}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Dosen Pengampu:</span>
                                    <span className="text-gray-900 font-medium text-right max-w-[60%]">{soal.dosenPengampu}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Unduhan:</span>
                                    <div className="flex items-center gap-1 text-gray-900 font-medium">
                                        <Download className="w-3 h-3" />
                                        {soal.downloads}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                        soal.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {soal.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                                <button 
                                    onClick={() => handleOpenModal('edit', soal)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(soal.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mata Kuliah</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kode MK</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Jenis Ujian</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Semester</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tahun Ajaran</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Program Studi</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Dosen</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Unduhan</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {soals.map(soal => (
                                <tr key={soal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="font-bold text-gray-900 text-sm">{soal.namaMatkul}</div>
                                        <div className="text-xs text-gray-400 mt-1">{soal.fakultas}</div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <span className="font-medium text-rose-600 text-sm">{soal.kodeMatkul}</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">{soal.jenisUjian}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">{soal.semester}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">{soal.tahunAjaran}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 max-w-[200px]">{soal.programStudi}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 max-w-[200px]">{soal.dosenPengampu}</td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Download className="w-3.5 h-3.5" />
                                            {soal.downloads}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <span className={`px-2.5 md:px-3 py-1 text-xs font-bold rounded-full ${
                                            soal.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                        }`}>
                                            {soal.status}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleOpenModal('edit', soal)}
                                                className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(soal.id)}
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
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {modalMode === 'create' ? 'Tambah' : 'Edit'} Soal
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Soal</label>
                                <input
                                    type="text"
                                    required
                                    value={soalForm.title}
                                    onChange={(e) => setSoalForm({ ...soalForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                    placeholder="Contoh: UTS Pemrograman Web 2023"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                                <select
                                    required
                                    value={soalForm.matkul_id}
                                    onChange={(e) => setSoalForm({ ...soalForm, matkul_id: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                >
                                    <option value="">Pilih Mata Kuliah</option>
                                    {matkuls.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Ujian</label>
                                    <select
                                        required
                                        value={soalForm.type}
                                        onChange={(e) => setSoalForm({ ...soalForm, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                    >
                                        <option value="UTS">UTS</option>
                                        <option value="UAS">UAS</option>
                                        <option value="Kuis">Kuis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                                    <input
                                        type="number"
                                        required
                                        value={soalForm.year}
                                        onChange={(e) => setSoalForm({ ...soalForm, year: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    required
                                    value={soalForm.status}
                                    onChange={(e) => setSoalForm({ ...soalForm, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all"
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Nonaktif">Nonaktif</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File Soal (PDF) {modalMode === 'edit' && '(Biarkan kosong jika tidak ubah)'}</label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    required={modalMode === 'create'}
                                    onChange={(e) => setSoalForm({ ...soalForm, file: e.target.files[0] })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all bg-gray-50"
                                />
                            </div>
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

export default ManajemenSoal;
