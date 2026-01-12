import React from 'react';
import { Edit, Trash2, Download } from 'lucide-react';

const SoalTable = ({ soals, onEdit, onDelete }) => {
    return (
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
                                            onClick={() => onEdit(soal)}
                                            className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(soal.id)}
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
    );
};

export default SoalTable;
