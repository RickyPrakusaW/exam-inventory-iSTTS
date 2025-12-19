import React from 'react';
import { TrendingUp, BookOpen, CheckCircle, Clock, Award, Target } from 'lucide-react';

const ProgresBelajar = () => {
    const stats = [
        { label: 'Soal Diunduh', value: '24', icon: <BookOpen className="text-blue-600" />, bg: 'bg-blue-50' },
        { label: 'Soal Diselesaikan', value: '18', icon: <CheckCircle className="text-green-600" />, bg: 'bg-green-50' },
        { label: 'Waktu Belajar', value: '32 jam', icon: <Clock className="text-amber-600" />, bg: 'bg-amber-50' },
        { label: 'Pencapaian', value: '12', icon: <Award className="text-rose-600" />, bg: 'bg-rose-50' }
    ];

    const recentProgress = [
        {
            id: 1,
            matkul: 'Algoritma dan Pemrograman',
            progress: 85,
            status: 'Sedang Berjalan',
            lastActivity: '2 hari yang lalu'
        },
        {
            id: 2,
            matkul: 'Basis Data',
            progress: 60,
            status: 'Sedang Berjalan',
            lastActivity: '5 hari yang lalu'
        },
        {
            id: 3,
            matkul: 'Pemrograman Web',
            progress: 100,
            status: 'Selesai',
            lastActivity: '1 minggu yang lalu'
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-rose-600" size={32} />
                    Progres Belajar
                </h1>
                <p className="text-gray-500 text-lg">Pantau perkembangan dan pencapaian belajar Anda</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className={`p-3 ${stat.bg} rounded-xl w-fit mb-3`}>
                            {stat.icon}
                        </div>
                        <p className="text-2xl font-black text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Progress List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Target size={20} className="text-rose-500" />
                    Progres Mata Kuliah
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {recentProgress.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1 flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{item.matkul}</h3>
                                    <p className="text-xs text-gray-500">{item.lastActivity}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                    item.status === 'Selesai' 
                                        ? 'bg-green-50 text-green-600' 
                                        : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 font-medium">Progress</span>
                                    <span className="text-gray-900 font-bold">{item.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            item.progress === 100 
                                                ? 'bg-green-500' 
                                                : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgresBelajar;

