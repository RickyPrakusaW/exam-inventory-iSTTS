import React, { useState, useEffect } from 'react';

const SoalFormModal = ({ isOpen, onClose, onSubmit, initialData, matkuls }) => {
    const [soalForm, setSoalForm] = useState({ 
        title: '', 
        type: 'UTS', 
        year: new Date().getFullYear(), 
        matkul_id: '', 
        status: 'Aktif',
        file: null
    });

    const mode = initialData ? 'edit' : 'create';

    useEffect(() => {
        if (initialData) {
            setSoalForm({
                title: initialData.title || '',
                type: initialData.jenisUjian || 'UTS',
                year: parseInt(initialData.tahunAjaran?.split('/')[0]) || new Date().getFullYear(),
                matkul_id: initialData.matkul_id || '', 
                status: initialData.status || 'Aktif',
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
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(soalForm);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">
                        {mode === 'create' ? 'Tambah' : 'Edit'} Soal
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Soal (PDF) {mode === 'edit' && '(Biarkan kosong jika tidak ubah)'}</label>
                        <input
                            type="file"
                            accept=".pdf"
                            required={mode === 'create'}
                            onChange={(e) => setSoalForm({ ...soalForm, file: e.target.files[0] })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all bg-gray-50"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
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
    );
};

export default SoalFormModal;
