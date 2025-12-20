import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, Filter, Database } from 'lucide-react';

const EksporData = () => {
    const [selectedType, setSelectedType] = useState('soal');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const exportTypes = [
        {
            id: 'soal',
            name: 'Data Soal',
            desc: 'Ekspor semua data soal beserta metadata',
            icon: <FileText className="text-blue-600" />,
            bg: 'bg-blue-50',
            count: '1,247 soal'
        },
        {
            id: 'mahasiswa',
            name: 'Data Mahasiswa',
            desc: 'Ekspor data mahasiswa dan aktivitas',
            icon: <Database className="text-green-600" />,
            bg: 'bg-green-50',
            count: '3,456 mahasiswa'
        },
        {
            id: 'unduhan',
            name: 'Riwayat Unduhan',
            desc: 'Ekspor log semua aktivitas unduhan',
            icon: <Download className="text-amber-600" />,
            bg: 'bg-amber-50',
            count: '12,890 unduhan'
        },
        {
            id: 'laporan',
            name: 'Laporan Mahasiswa',
            desc: 'Ekspor semua laporan dari mahasiswa',
            icon: <FileSpreadsheet className="text-rose-600" />,
            bg: 'bg-rose-50',
            count: '65 laporan'
        }
    ];

    const handleExport = () => {
        // Simulasi export
        alert(`Mengekspor data ${exportTypes.find(t => t.id === selectedType)?.name}...`);
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 md:gap-3">
                    <Download className="text-rose-600 w-7 h-7 md:w-8 md:h-8" />
                    <span>Ekspor Data</span>
                </h1>
                <p className="text-gray-500 text-base md:text-lg">Ekspor data sistem dalam berbagai format</p>
            </div>

            {/* Export Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportTypes.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all text-left ${
                            selectedType === type.id
                                ? 'border-rose-500 bg-rose-50 shadow-md'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                    >
                        <div className="flex items-start gap-3 md:gap-4">
                            <div className={`p-2 md:p-3 ${type.bg} rounded-lg md:rounded-xl shrink-0`}>
                                {type.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1">{type.name}</h3>
                                <p className="text-xs md:text-sm text-gray-500 mb-2 leading-relaxed">{type.desc}</p>
                                <p className="text-[10px] md:text-xs text-gray-400 font-medium">{type.count}</p>
                            </div>
                            {selectedType === type.id && (
                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Export Options */}
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-5 md:space-y-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">Opsi Ekspor</h2>
                
                {/* Date Range */}
                <div className="space-y-3 md:space-y-4">
                    <label className="block text-xs md:text-sm font-bold text-gray-700">Rentang Tanggal (Opsional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label className="block text-[10px] md:text-xs text-gray-500 mb-2">Dari Tanggal</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-[18px] md:h-[18px]" />
                                <input
                                    type="date"
                                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs text-gray-500 mb-2">Sampai Tanggal</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-[18px] md:h-[18px]" />
                                <input
                                    type="date"
                                    className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none text-sm md:text-base"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Format Selection */}
                <div className="space-y-3 md:space-y-4">
                    <label className="block text-xs md:text-sm font-bold text-gray-700">Format File</label>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <label className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-rose-200 transition-colors flex-1">
                            <input type="radio" name="format" value="xlsx" defaultChecked className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                            <FileSpreadsheet className="text-green-600 w-5 h-5 md:w-6 md:h-6 shrink-0" />
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm md:text-base">Excel (.xlsx)</p>
                                <p className="text-[10px] md:text-xs text-gray-500">Format spreadsheet</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-rose-200 transition-colors flex-1">
                            <input type="radio" name="format" value="csv" className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                            <FileText className="text-blue-600 w-5 h-5 md:w-6 md:h-6 shrink-0" />
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm md:text-base">CSV (.csv)</p>
                                <p className="text-[10px] md:text-xs text-gray-500">Format teks</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Export Button */}
                <div className="pt-3 md:pt-4 border-t border-gray-100">
                    <button
                        onClick={handleExport}
                        className="w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-rose-600 text-white text-sm md:text-base font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 active:scale-95"
                    >
                        <Download className="w-4 h-4 md:w-5 md:h-5" />
                        Ekspor Data
                    </button>
                </div>
            </div>

            {/* Recent Exports */}
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Ekspor Terakhir</h2>
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 md:gap-4">
                            <FileSpreadsheet className="text-green-600 w-5 h-5 md:w-6 md:h-6 shrink-0" />
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm md:text-base">Data Soal - 20 Jan 2025</p>
                                <p className="text-[10px] md:text-xs text-gray-500">1,247 records • Excel format</p>
                            </div>
                        </div>
                        <button className="text-rose-600 hover:text-rose-700 font-bold text-xs md:text-sm text-left sm:text-right active:scale-95">
                            Unduh Lagi
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 md:gap-4">
                            <FileText className="text-blue-600 w-5 h-5 md:w-6 md:h-6 shrink-0" />
                            <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm md:text-base">Riwayat Unduhan - 18 Jan 2025</p>
                                <p className="text-[10px] md:text-xs text-gray-500">12,890 records • CSV format</p>
                            </div>
                        </div>
                        <button className="text-rose-600 hover:text-rose-700 font-bold text-xs md:text-sm text-left sm:text-right active:scale-95">
                            Unduh Lagi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EksporData;

