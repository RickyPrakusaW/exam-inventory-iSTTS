import React from 'react';
import { Edit, Trash2, Calendar, Eye } from 'lucide-react';

const BeritaCard = ({ item, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4 mb-4">
                <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <span className={`px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-full ${
                            item.type === 'Pengumuman' ? 'bg-blue-50 text-blue-600' :
                            item.type === 'Informasi' ? 'bg-amber-50 text-amber-600' :
                            'bg-green-50 text-green-600'
                        }`}>
                            {item.type}
                        </span>
                        <span className={`px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-full ${
                            item.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                        }`}>
                            {item.status}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-[10px] md:text-xs text-gray-400 pt-2">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 md:w-[14px] md:h-[14px]" />
                            {item.startDate} - {item.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 md:w-[14px] md:h-[14px]" />
                            {item.views} dilihat
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-50">
                <button 
                    onClick={() => onEdit && onEdit(item)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors active:scale-95">
                    <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Edit
                </button>
                <button 
                    onClick={() => onDelete && onDelete(item.id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95">
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Hapus
                </button>
            </div>
        </div>
    );
};

export default BeritaCard;
