import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Bookmark, ThumbsUp, FileText, Send, CheckSquare, Square, Mail, Flag, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useConfirmation } from '../contexts/ConfirmationContext';

const PencarianSoal = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJurusan, setSelectedJurusan] = useState('');
    const [selectedType, setSelectedType] = useState('');
    
    // Selection Mode State
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Report State
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedSoalForReport, setSelectedSoalForReport] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [reportType, setReportType] = useState('Soal Rusak');

    // Email Modal State
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [targetEmail, setTargetEmail] = useState('');

    const [soals, setSoals] = useState([]);
    const [prodiList, setProdiList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProdi = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/master/prodi');
            if (response.ok) {
                const data = await response.json();
                setProdiList(data);
            }
        } catch (error) {
            console.error("Failed to fetch prodi", error);
        }
    };

    const fetchSoals = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const url = userId 
                ? `http://localhost:5000/api/soal?userId=${userId}` 
                : 'http://localhost:5000/api/soal';
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                // Filter only 'Aktif' soals for normal users
                setSoals(data.filter(s => s.status === 'Aktif'));
            }
        } catch (error) {
            console.error("Failed to fetch soals", error);
        } finally {
            setLoading(false);
        }
    };

    const [savedSoals, setSavedSoals] = useState(new Set());

    const fetchSavedSoals = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await fetch(`http://localhost:5000/api/library/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const ids = new Set(data.map(item => item.id));
                setSavedSoals(ids);
            }
        } catch (error) {
            console.error("Failed to fetch saved soals", error);
        }
    };

    // [NEW] Sync savedSoals state with fetched soals if available
    useEffect(() => {
        if (soals.length > 0) {
            const newSaved = new Set(savedSoals);
            soals.forEach(s => {
                if (s.isSaved) newSaved.add(s.id);
            });
            // Only update if size differs to avoid loop, 
            // though strictly we should compare contents. 
            // Simplified: we trust the backend 'isSaved' more.
            // Actually, let's just use the 'savedSoals' set as the source of truth for UI
            // and initialize it from both fetchSavedSoals and fetchSoals (if needed).
            // But since we fetch all saved soals separately, that should be enough?
            // The issue is likely that the separate fetch might fail or be slow.
            // Let's rely on the separate fetch primarily, but 'isSaved' helps initial load?
            // The User reported buttons not lighting up.
            
            // BETTER APPROACH:
            // Use the 'isSaved' from 'soals' to populate 'savedSoals' initial state if 'savedSoals' is empty?
            // Or just update 'savedSoals' whenever 'soals' changes?
             const initialSaved = new Set(savedSoals);
             let changed = false;
             soals.forEach(s => {
                 if (s.isSaved && !initialSaved.has(s.id)) {
                     initialSaved.add(s.id);
                     changed = true;
                 }
             });
             if (changed) setSavedSoals(initialSaved);
        }
    }, [soals]);

    useEffect(() => {
        fetchProdi();
        fetchSoals();
        fetchSavedSoals();
    }, []);

    // Filter hasil pencarian
    const filteredResults = soals.filter(soal => {
        const matchesSearch = searchTerm === '' || 
            soal.namaMatkul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soal.kodeMatkul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soal.programStudi?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesJurusan = selectedJurusan === '' || soal.programStudi === selectedJurusan;
        const matchesType = selectedType === '' || soal.jenisUjian === selectedType;
        
        return matchesSearch && matchesJurusan && matchesType;
    });

    const handleDownload = async (soalId, currentUrl) => {
        const userId = localStorage.getItem('userId');
        
        // If user is logged in, track history
        if (userId) {
            try {
                const response = await fetch(`http://localhost:5000/api/soal/${soalId}/download`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Update local state to reflect increased download count
                    setSoals(prevSoals => prevSoals.map(s => 
                        s.id === soalId 
                            ? { ...s, downloads: (s.downloads || 0) + 1 }
                            : s
                    ));

                    if (data.file_url) {
                         window.open(data.file_url, '_blank');
                         return;
                    }
                }
            } catch (error) {
                console.error("Failed to record download history", error);
                // Fallback to direct download if tracking fails
            }
        }
        
        // Default behavior (not logged in or API failed)
        if (currentUrl) {
            window.open(currentUrl, '_blank');
        } else {
            showToast("File URL not found", "error");
        }
    };

    const handleSave = async (soalId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }

        // Ensure robust comparison by converting to number if needed, 
        // assuming IDs are numbers from the backend for consistency.
        const idToCheck = Number(soalId); 
        const isSaved = savedSoals.has(idToCheck);

        try {
            let response;
            if (isSaved) {
                // Remove from library
                response = await fetch(`http://localhost:5000/api/library/${userId}/${idToCheck}`, {
                    method: 'DELETE'
                });
            } else {
                // Add to library
                response = await fetch('http://localhost:5000/api/library', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, soalId: idToCheck })
                });
            }
            
            if (response.ok) {
                // Update state
                setSavedSoals(prev => {
                    const next = new Set(prev);
                    if (isSaved) {
                        next.delete(idToCheck);
                    } else {
                        next.add(idToCheck);
                    }
                    return next;
                });

                // Show toast only once, outside the setter
                if (isSaved) {
                    showToast('Dihapus dari perpustakaan pribadi', 'success');
                } else {
                    showToast('Disimpan ke perpustakaan pribadi', 'success');
                }
            } else {
                const data = await response.json();
                showToast(data.message || 'Gagal mengubah status simpan', 'error');
            }
        } catch (error) {
            console.error("Failed to toggle save soal", error);
            showToast("Terjadi kesalahan", 'error');
        }
    };

    const toggleSelection = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectionMode = () => {
        if (selectionMode) {
            setSelectionMode(false);
            setSelectedIds(new Set());
        } else {
            setSelectionMode(true);
        }
    };

    const handleEmailFiles = () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }

        if (selectedIds.size === 0) {
            showToast('Pilih minimal satu file', 'warning');
            return;
        }

        // Open modal
        setEmailModalOpen(true);
        setTargetEmail(''); // Reset email or could pre-fill if we had user email in local state
    };

    const sendEmailWithTarget = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        
        if (!targetEmail || !targetEmail.includes('@')) {
            showToast('Mohon masukkan email yang valid', 'warning');
            return;
        }

        try {
            showToast('Sedang mengirim email...', 'info');
            const response = await fetch('http://localhost:5000/api/soal/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId, 
                    soalIds: Array.from(selectedIds),
                    targetEmail: targetEmail
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast(`Email berhasil dikirim ke ${targetEmail}!`, 'success');
                setSelectionMode(false);
                setSelectedIds(new Set());
                setEmailModalOpen(false);
            } else {
                showToast(data.message || 'Gagal mengirim email', 'error');
            }
        } catch (error) {
            console.error("Failed to send email", error);
            showToast('Terjadi kesalahan saat mengirim email', 'error');
        }
    };

    const handleReportClick = (soal) => {
        setSelectedSoalForReport(soal);
        setReportModalOpen(true);
        setReportReason('');
        setReportType('Soal Rusak');
    };

    const submitReport = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/laporan/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    soalId: selectedSoalForReport.id,
                    reason: reportReason,
                    jenis: reportType
                })
            });

            if (response.ok) {
                showToast('Laporan berhasil dikirim', 'success');
                setReportModalOpen(false);
            } else {
                const data = await response.json();
                showToast(data.message || 'Gagal mengirim laporan', 'error');
            }
        } catch (error) {
            console.error('Failed to submit report', error);
            showToast('Terjadi kesalahan', 'error');
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                    <Search className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                    <span>Pencarian Soal</span>
                </h1>
                <p className="text-gray-500 text-base md:text-lg">Cari dan temukan arsip soal yang Anda butuhkan</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                            type="text"
                            placeholder="Cari mata kuliah, kode MK, atau program studi..."
                            className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                            <select 
                                className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                                value={selectedJurusan}
                                onChange={(e) => setSelectedJurusan(e.target.value)}
                            >
                                <option value="">Semua Jurusan</option>
                                {prodiList.map(prodi => (
                                    <option key={prodi.id} value={prodi.name}>{prodi.name}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                        <div className="relative">
                            <select 
                                className="appearance-none w-full bg-gray-50 border border-gray-100 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl pr-10 md:pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer text-sm md:text-base"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="">Semua Jenis Ujian</option>
                                <option value="UTS">UTS</option>
                                <option value="UAS">UAS</option>
                                <option value="Kuis">Kuis</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                            <Filter className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </div>
                    </div>
                    {(selectedJurusan || selectedType || searchTerm) && (
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedJurusan('');
                                setSelectedType('');
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm md:text-base font-medium rounded-xl md:rounded-2xl transition-all active:scale-95"
                        >
                            Reset Filter
                        </button>
                    )}
                    
                    <div className="flex-1 sm:flex-none flex gap-2">
                        <button
                            onClick={toggleSelectionMode}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl transition-all active:scale-95 text-sm md:text-base font-medium ${
                                selectionMode 
                                ? 'bg-gray-800 text-white hover:bg-gray-900' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {selectionMode ? 'Batal Pilih' : 'Pilih File'}
                        </button>
                        
                        {selectionMode && selectedIds.size > 0 && (
                            <button
                                onClick={handleEmailFiles}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl md:rounded-2xl transition-all active:scale-95 text-sm md:text-base font-bold shadow-lg shadow-rose-200"
                            >
                                <Mail size={18} />
                                <span>Kirim Email ({selectedIds.size})</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-base md:text-lg font-bold text-gray-800">Hasil Pencarian</h2>
                    <span className="text-xs md:text-sm text-gray-500">
                        {loading ? 'Memuat...' : `${filteredResults.length} hasil ditemukan`}
                    </span>
                </div>
                
                {loading ? (
                     <div className="text-center py-12 text-gray-500">Memuat data soal...</div>
                ) : filteredResults.length === 0 ? (
                    <div className="bg-white p-8 md:p-12 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm text-center">
                        <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm md:text-base">Tidak ada soal yang ditemukan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredResults.map(soal => (
                            <div key={soal.id} 
                                className={`bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all ${
                                    selectionMode && selectedIds.has(soal.id)
                                    ? 'border-rose-500 ring-1 ring-rose-500 shadow-md bg-rose-50/10'
                                    : 'border-gray-100 shadow-sm hover:shadow-md'
                                }`}
                                onClick={() => selectionMode && toggleSelection(soal.id)}
                            >
                                <div className="mb-4 space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1 flex gap-3">
                                            {selectionMode && (
                                                <div className="pt-1">
                                                    {selectedIds.has(soal.id) ? (
                                                        <CheckSquare className="text-rose-600 w-5 h-5" />
                                                    ) : (
                                                        <Square className="text-gray-300 w-5 h-5" />
                                                    )}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight mb-1">
                                                    {soal.namaMatkul}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 mb-2">
                                                    <span className="font-medium text-rose-600">{soal.kodeMatkul}</span>
                                                    <span>•</span>
                                                    <span>{soal.jenisUjian}</span>
                                                    <span>•</span>
                                                    <span>{soal.semester}</span>
                                                    <span>•</span>
                                                    <span>{soal.tahunAjaran}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full whitespace-nowrap">
                                            {soal.jenisUjian}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5 text-xs md:text-sm">
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            <div>
                                                <span className="text-gray-500">Program Studi:</span>
                                                <span className="text-gray-900 font-medium ml-1">{soal.programStudi}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Fakultas:</span>
                                                <span className="text-gray-900 font-medium ml-1">{soal.fakultas}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 pt-4 border-t border-gray-50">
                                    <button 
                                        onClick={() => handleDownload(soal.id, soal.file_url)}
                                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95 flex-shrink-0"
                                    >
                                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span>Unduh</span>
                                    </button>
                                    <button 
                                        onClick={() => handleSave(soal.id)}
                                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 ${
                                            savedSoals.has(soal.id)
                                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        } rounded-lg md:rounded-xl transition-colors active:scale-95 flex-shrink-0`}
                                    >
                                        <Bookmark className={`w-3.5 h-3.5 md:w-4 md:h-4 ${savedSoals.has(soal.id) ? 'fill-current' : ''}`} />
                                        <span>{savedSoals.has(soal.id) ? 'Disimpan' : 'Simpan'}</span>
                                    </button>
                                    <div className="flex items-center gap-1.5 md:gap-2 ml-auto md:ml-0">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReportClick(soal);
                                            }}
                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Laporkan Masalah"
                                        >
                                            <Flag className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                        </button>
                                        <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 px-2 pl-3 border-l border-gray-200">
                                            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            <span>{soal.downloads}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {reportModalOpen && selectedSoalForReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Flag className="w-5 h-5 text-rose-600" />
                                Laporkan Masalah
                            </h3>
                            <button 
                                onClick={() => setReportModalOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 md:p-6">
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Melaporkan Soal:</p>
                                <p className="font-bold text-gray-900 line-clamp-1">{selectedSoalForReport.namaMatkul}</p>
                            </div>

                            <form onSubmit={submitReport} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Masalah</label>
                                    <select 
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none text-sm font-medium text-gray-700"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                    >
                                        <option value="Soal Rusak">File Rusak / Tidak Bisa Dibuka</option>
                                        <option value="Soal Tidak Sesuai">Informasi Tidak Sesuai (Matkul/Prodi/Tahun salah)</option>
                                        <option value="Duplikat">Duplikat Soal</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi Masalah</label>
                                    <textarea 
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none text-sm min-h-[100px] resize-none"
                                        placeholder="Jelaskan detail masalah yang Anda temukan..."
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setReportModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                                    >
                                        Kirim Laporan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {emailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-rose-600" />
                                Kirim File ke Email
                            </h3>
                            <button 
                                onClick={() => setEmailModalOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 md:p-6">
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Anda akan mengirim {selectedIds.size} file terpilih.</p>
                                <p className="text-sm text-gray-700">Silakan masukkan alamat email tujuan pengiriman file.</p>
                            </div>

                            <form onSubmit={sendEmailWithTarget} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Alamat Email</label>
                                    <input 
                                        type="email"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                                        placeholder="contoh@email.com"
                                        value={targetEmail}
                                        onChange={(e) => setTargetEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setEmailModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                                    >
                                        Kirim
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PencarianSoal;
