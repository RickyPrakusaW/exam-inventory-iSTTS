import React, { useState, useEffect } from 'react';
import { Bookmark, Download, Trash2, Calendar } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useConfirmation } from '../contexts/ConfirmationContext';

const PerpustakaanPribadi = () => {
    const { showToast } = useToast();
    const { confirm } = useConfirmation();
    const [savedSoals, setSavedSoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    const fetchLibrary = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/library/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setSavedSoals(data);
            }
        } catch (error) {
            console.error("Failed to fetch library", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLibrary();
    }, [userId]);

    const handleRemove = async (soalId) => {
        const isConfirmed = await confirm({
            title: 'Hapus Soal',
            message: 'Apakah Anda yakin ingin menghapus soal ini dari perpustakaan pribadi?',
            confirmText: 'Hapus',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:5000/api/library/${userId}/${soalId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setSavedSoals(prev => prev.filter(s => s.id !== soalId));
            } else {
                showToast('Gagal menghapus', 'error');
            }
        } catch (error) {
            console.error('Error removing soal:', error);
        }
    };

    const handleDownload = (url) => {
        if (url) window.open(url, '_blank');
        else showToast('File URL not found', 'error');
    };

    if (loading) return <div className="text-center py-12 text-gray-500">Memuat perpustakaan...</div>;

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Bookmark className="text-rose-600" size={32} />
                    Perpustakaan Pribadi
                </h1>
                <p className="text-gray-500 text-lg">Soal-soal yang telah Anda simpan untuk referensi belajar</p>
            </div>

            {savedSoals.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <Bookmark size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Soal Tersimpan</h3>
                    <p className="text-gray-500">Mulai simpan soal favorit Anda untuk akses cepat di kemudian hari</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {savedSoals.map(soal => (
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
                                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                                        <Calendar size={14} />
                                        <span>Disimpan: {new Date(soal.savedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-4 border-t border-gray-50">
                                <button 
                                    onClick={() => handleDownload(soal.file_url)}
                                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95"
                                >
                                    <Download size={14} className="md:w-4 md:h-4" /> 
                                    <span>Unduh</span>
                                </button>
                                <button 
                                    onClick={() => handleRemove(soal.id)}
                                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg md:rounded-xl transition-colors active:scale-95"
                                >
                                    <Trash2 size={14} className="md:w-4 md:h-4" /> 
                                    <span>Hapus</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PerpustakaanPribadi;
