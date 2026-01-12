import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Bookmark, ThumbsUp, FileText } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const PencarianSoal = () => {
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJurusan, setSelectedJurusan] = useState('');
    const [selectedType, setSelectedType] = useState('');

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
            const response = await fetch('http://localhost:5000/api/soal');
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

    useEffect(() => {
        fetchProdi();
        fetchSoals();
    }, []);

    // Filter hasil pencarian
    const filteredResults = soals.filter(soal => {
        const matchesSearch = searchTerm === '' || 
            soal.namaMatkul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soal.kodeMatkul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soal.programStudi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            soal.dosenPengampu?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesJurusan = selectedJurusan === '' || soal.programStudi === selectedJurusan;
        const matchesType = selectedType === '' || soal.jenisUjian === selectedType;
        
        return matchesSearch && matchesJurusan && matchesType;
    });

    const handleDownload = (url) => {
        if (!url) {
            showToast("File URL not found", "error");
            return;
        }
        window.open(url, '_blank');
    };

    const handleSave = async (soalId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            showToast('Silakan login terlebih dahulu', 'warning');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, soalId })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showToast('Berhasil disimpan ke perpustakaan pribadi', 'success');
            } else {
                showToast(data.message || 'Gagal menyimpan', 'error');
            }
        } catch (error) {
            console.error("Failed to save soal", error);
            showToast("Terjadi kesalahan saat menyimpan", 'error');
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
                            placeholder="Cari mata kuliah, kode MK, program studi, atau dosen..."
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
                            <div key={soal.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="mb-4 space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1">
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
                                        <div>
                                            <span className="text-gray-500">Dosen Pengampu:</span>
                                            <span className="text-gray-900 font-medium ml-1">{soal.dosenPengampu}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 pt-4 border-t border-gray-50">
                                    <button 
                                        onClick={() => handleDownload(soal.file_url)}
                                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95 flex-shrink-0"
                                    >
                                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span>Unduh</span>
                                    </button>
                                    <button 
                                        onClick={() => handleSave(soal.id)}
                                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg md:rounded-xl transition-colors active:scale-95 flex-shrink-0"
                                    >
                                        <Bookmark className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span>Simpan</span>
                                    </button>
                                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-500 ml-auto md:ml-0">
                                        <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span>{soal.downloads}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PencarianSoal;
