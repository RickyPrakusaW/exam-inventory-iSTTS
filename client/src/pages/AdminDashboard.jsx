import React, { useState, useEffect } from 'react';
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
    FileCheck,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getBerita } from '../services/beritaService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSoal: 0,
        mahasiswaCount: 0,
        totalDownloads: 0,
        laporanCount: 0
    });
    const [popularSoals, setPopularSoals] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [activeNews, setActiveNews] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/'); // Redirect if no token
                    return;
                }

                // Parallel fetch for dashboard stats and news
                const [statsResponse, newsData] = await Promise.all([
                    fetch('http://localhost:5000/api/dashboard/stats', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    getBerita()
                ]);

                if (statsResponse.ok) {
                    const data = await statsResponse.json();
                    setStats(data.stats);
                    setPopularSoals(data.popularSoals);
                    setRecentActivities(data.recentActivities);
                } else {
                    console.error('Failed to fetch dashboard stats');
                }

                if (newsData) {
                    // Filter active news and sort by start date descending
                    const active = newsData
                        .filter(item => item.status === 'Aktif')
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                        .slice(0, 5); // Take top 5
                    setActiveNews(active);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const statCards = [
        { title: 'Total Arsip Soal', value: stats.totalSoal, icon: <FileText className="text-blue-600" />, bg: 'bg-blue-50' },
        { title: 'Mahasiswa Terdaftar', value: stats.mahasiswaCount, icon: <Users className="text-green-600" />, bg: 'bg-green-50' },
        { title: 'Total Unduhan', value: stats.totalDownloads, icon: <Download className="text-amber-600" />, bg: 'bg-amber-50' },
        { title: 'Laporan Masuk', value: stats.laporanCount, icon: <AlertCircle className="text-rose-600" />, bg: 'bg-rose-50' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-rose-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 pb-12">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Admin</h1>
                <p className="text-gray-500 text-base md:text-lg">Ringkasan statistik sistem bank soal</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {statCards.map((stat, index) => (
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
                {/* Berita Aktif - Static or Empty for now as no backend support */}
                {activeNews.length > 0 ? (
                    <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Bell className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
                                <span>Berita Aktif</span>
                            </h2>
                        </div>          
                        <div className="space-y-3 md:space-y-4">
                            {activeNews.map((news, idx) => (
                                <div key={idx} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-l-4 flex items-center justify-between bg-gray-50 ${'border-blue-500'}`}>
                                    <div className="space-y-1 flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{news.title}</h3>
                                        {/* <p className="text-[10px] md:text-[11px] text-gray-400">Berakhir: {news.expiry}</p> */}
                                    </div>
                                    <ChevronRight className="text-gray-300 w-4 h-4 md:w-[18px] md:h-[18px] shrink-0 ml-2" />
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                   <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6 flex items-center justify-center min-h-[200px]">
                        <div className="text-center space-y-2">
                             <Bell className="text-gray-300 w-10 h-10 mx-auto" />
                             <p className="text-gray-400 text-sm">Belum ada berita aktif</p>
                        </div>
                   </section>
                )}

                {/* Aktivitas Terbaru */}
                <section className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
                        <span>Aktivitas Terbaru</span>
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                        {recentActivities.length > 0 ? recentActivities.map(activity => (
                            <div key={activity.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 group hover:bg-gray-100 transition-colors">
                                <div className={`p-2 rounded-full shrink-0 ${activity.type === 'upload' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {activity.type === 'upload' ? <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-tight">{activity.title}</h3>
                                    <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">{new Date(activity.time).toLocaleString()}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-sm text-center py-4">Belum ada aktivitas terbaru</p>
                        )}
                    </div>
                </section>

                {/* Soal Populer */}
                <section className="lg:col-span-2 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="text-rose-500 w-4 h-4 md:w-5 md:h-5" />
                        <span>Soal Populer</span>
                    </h2>
                    <div className="space-y-2">
                        {popularSoals.length > 0 ? popularSoals.map(soal => (
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
                                            <span>Semester {soal.semester}</span>
                                            <span>•</span>
                                            <span>{soal.tahunAjaran}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] md:text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 md:px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
                                    {soal.downloads} unduhan
                                </span>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-sm text-center py-4">Belum ada soal populer</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
