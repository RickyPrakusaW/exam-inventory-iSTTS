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
        { id: 1, title: 'UAS Algoritma 2023', prodi: 'Teknik Informatika', downloads: '456 unduhan' },
        { id: 2, title: 'UTS Kalkulus 2023', prodi: 'Teknik Sipil', downloads: '383 unduhan' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Admin</h1>
                <p className="text-gray-500 text-lg">Ringkasan statistik sistem bank soal</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Berita Aktif */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Bell size={20} className="text-rose-500" />
                            Berita Aktif
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {activeNews.map(news => (
                            <div key={news.id} className={`p-4 rounded-2xl border-l-4 flex items-center justify-between bg-gray-50 ${news.color === 'blue' ? 'border-blue-500' : 'border-amber-500'}`}>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-800 text-sm">{news.title}</h3>
                                    <p className="text-[11px] text-gray-400">Berakhir: {news.expiry}</p>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Aktivitas Terbaru */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock size={20} className="text-rose-500" />
                        Aktivitas Terbaru
                    </h2>
                    <div className="space-y-4">
                        {recentActivities.map(activity => (
                            <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 group hover:bg-gray-100 transition-colors">
                                <div className={`p-2 rounded-full ${activity.type === 'upload' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {activity.type === 'upload' ? <Plus size={16} /> : <UserPlus size={16} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-sm">{activity.title}</h3>
                                    <p className="text-[11px] text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Soal Populer */}
                <section className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp size={20} className="text-rose-500" />
                        Soal Populer
                    </h2>
                    <div className="space-y-2">
                        {popularSoals.map(soal => (
                            <div key={soal.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <FileCheck size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{soal.title}</h3>
                                        <p className="text-[11px] text-gray-400">{soal.prodi}</p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    {soal.downloads}
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
