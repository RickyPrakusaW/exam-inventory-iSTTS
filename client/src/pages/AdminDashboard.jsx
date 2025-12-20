import React from 'react';
import { 
    FileText, 
    Users, 
    Download, 
    AlertCircle, 
    Bell, 
    Clock, 
    TrendingUp,
    ChevronRight,
    Plus,
    UserPlus,
    FileCheck
} from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Arsip Soal', value: '1,247', icon: <FileText className="text-blue-600" />, bg: 'bg-blue-50' },
        { title: 'Mahasiswa Terdaftar', value: '3,456', icon: <Users className="text-green-600" />, bg: 'bg-green-50' },
        { title: 'Total Unduhan', value: '12,890', icon: <Download className="text-amber-600" />, bg: 'bg-amber-50' },
        { title: 'Laporan Masuk', value: '23', icon: <AlertCircle className="text-rose-600" />, bg: 'bg-rose-50' },
    ];

    const activeNews = [
        { id: 1, title: 'Jadwal UTS 2025 Dipindah', expiry: '28 Maret 2025', color: 'blue' },
        { id: 2, title: 'Perpanjangan Waktu Upload', expiry: '15 April 2025', color: 'amber' },
    ];

    const recentActivities = [
        { id: 1, title: 'Soal UTS Matematika ditambahkan', time: '2 jam yang lalu', type: 'upload' },
        { id: 2, title: 'Mahasiswa baru terdaftar', time: '5 jam yang lalu', type: 'user' },
    ];

    const popularSoals = [
        { 
            id: 1, 
            namaMatkul: 'Algoritma dan Pemrograman',
            kodeMatkul: 'IF101',
            jenisUjian: 'UAS',
            semester: 'Ganjil',
            tahunAjaran: '2023/2024',
            programStudi: 'S1-Informatika',
            fakultas: 'Fakultas Teknologi Informasi',
            downloads: 456
        },
        { 
            id: 2, 
            namaMatkul: 'Kalkulus',
            kodeMatkul: 'MT101',
            jenisUjian: 'UAS',
            semester: 'Ganjil',
            tahunAjaran: '2023/2024',
            programStudi: 'S1-Teknik Elektro',
            fakultas: 'Fakultas Teknik',
            downloads: 383
        },
        {
            id: 3,
            namaMatkul: 'Basis Data',
            kodeMatkul: 'IF201',
            jenisUjian: 'UTS',
            semester: 'Genap',
            tahunAjaran: '2023/2024',
            programStudi: 'S1-Informatika',
            fakultas: 'Fakultas Teknologi Informasi',
            downloads: 312
        }
    ];

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Admin</h1>
                <p className="text-gray-500 text-base md:text-lg">Ringkasan statistik sistem bank soal</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 md:p-6 rounded-xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 group hover:shadow-md transition-all">
                        <div className={`p-2.5 md:p-4 ${stat.bg} rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform shrink-0`}>
                            <div className="w-5 h-5 md:w-6 md:h-6">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium text-gray-500 leading-tight">{stat.title}</p>
                            <p className="text-xl md:text-2xl font-black text-gray-900 mt-0.5 md:mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Berita Aktif */}
                <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Bell className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
                            <span>Berita Aktif</span>
                        </h2>
                    </div>          
                    <div className="space-y-3 md:space-y-4">
                        {activeNews.map(news => (
                            <div key={news.id} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-l-4 flex items-center justify-between bg-gray-50 ${news.color === 'blue' ? 'border-blue-500' : 'border-amber-500'}`}>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{news.title}</h3>
                                    <p className="text-[10px] md:text-[11px] text-gray-400">Berakhir: {news.expiry}</p>
                                </div>
                                <ChevronRight className="text-gray-300 w-4 h-4 md:w-[18px] md:h-[18px] shrink-0 ml-2" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Aktivitas Terbaru */}
                <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
                        <span>Aktivitas Terbaru</span>
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                        {recentActivities.map(activity => (
                            <div key={activity.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 group hover:bg-gray-100 transition-colors">
                                <div className={`p-2 rounded-full shrink-0 ${activity.type === 'upload' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {activity.type === 'upload' ? <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{activity.title}</h3>
                                    <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Soal Populer */}
                <section className="lg:col-span-2 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
                        <span>Soal Populer</span>
                    </h2>
                    <div className="space-y-2">
                        {popularSoals.map(soal => (
                            <div key={soal.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                    <div className="p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl shrink-0">
                                        <FileCheck className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                            <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{soal.namaMatkul}</h3>
                                            <span className="text-[10px] md:text-[11px] font-medium text-rose-600">{soal.kodeMatkul}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-[11px] text-gray-400">
                                            <span>{soal.programStudi}</span>
                                            <span>•</span>
                                            <span>{soal.jenisUjian}</span>
                                            <span>•</span>
                                            <span>{soal.semester}</span>
                                            <span>•</span>
                                            <span>{soal.tahunAjaran}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] md:text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 md:px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
                                    {soal.downloads} unduhan
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
