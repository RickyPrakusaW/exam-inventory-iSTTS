import React from 'react';
import { Edit, Trash2, Download } from 'lucide-react';

const SoalCard = ({ soal, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
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
                        onClick={() => onEdit(soal)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                    </button>
                    <button 
                        onClick={() => onDelete(soal.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SoalCard;
