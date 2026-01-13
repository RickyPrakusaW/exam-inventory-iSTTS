import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Download, 
    ThumbsUp, 
    Bell, 
    ChevronRight, 
    Sparkles,
    Clock,
    Filter
} from 'lucide-react';
import { getBerita } from '../services/beritaService';
import { useToast } from '../contexts/ToastContext';

const Home = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [popularSoals, setPopularSoals] = useState([]);
    const [recentSoals, setRecentSoals] = useState([]);


    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getBerita();
                const activeAnnouncements = data
                    .filter(item => item.status === 'Aktif')
                    .slice(0, 2)
                    .map(item => ({
                        id: item.id,
                        title: item.title,
                        desc: item.desc,
                        date: new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                        expiry: new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                        type: item.type,
                        color: item.type === 'Pengumuman' ? 'blue' : (item.type === 'Info' ? 'amber' : 'green')
                    }));
                setAnnouncements(activeAnnouncements);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            }
        };

        const fetchPopular = async () => {
             try {
                const response = await fetch('http://localhost:5000/api/soal/popular');
                if (response.ok) {
                    const data = await response.json();
                    setPopularSoals(data);
                }
             } catch (error) {
                 console.error("Failed to fetch popular soals", error);
             }
        };

        const fetchRecent = async () => {
            try {
               const response = await fetch('http://localhost:5000/api/soal/recent');
               if (response.ok) {
                   const data = await response.json();
                   setRecentSoals(data);
               }
            } catch (error) {
                console.error("Failed to fetch recent soals", error);
            }
       };



        fetchAnnouncements();
        fetchPopular();
        fetchRecent();

    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        } else {
             navigate('/search');
        }
    };

    const handleDownload = async (soalId, currentUrl) => {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
            try {
                const response = await fetch(`http://localhost:5000/api/soal/${soalId}/download`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.file_url) {
                        window.open(data.file_url, '_blank');
                        // Update UI counts locally if needed, but not critical for download
                        return;
                    }
                }
            } catch (error) {
                console.error("Download tracking failed", error);
            }
        }
        
        // Fallback
        if (currentUrl) {
            window.open(currentUrl, '_blank');
        } else {
            showToast("File URL not found", "error");
        }
    };

    const handleLike = async (soalId) => {
        // Check session storage
        const likedSoals = JSON.parse(sessionStorage.getItem('likedSoals') || '[]');
        
        if (likedSoals.includes(soalId)) {
            showToast("Anda sudah menyukai soal ini di sesi ini.", "info");
            return;
        }

        try {
             // Optimistic update
             const updateLikes = (list) => list.map(s => 
                s.id === soalId ? { ...s, likes: s.likes + 1 } : s
             );
             
             setPopularSoals(prev => updateLikes(prev));
             setRecentSoals(prev => updateLikes(prev));

            // Add to session storage immediately to prevent double clicks
            sessionStorage.setItem('likedSoals', JSON.stringify([...likedSoals, soalId]));

            const response = await fetch(`http://localhost:5000/api/soal/${soalId}/like`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('Failed to like');
            }
        } catch (error) {
            console.error("Like failed", error);
            // Revert changes if failed
             const revertLikes = (list) => list.map(s => 
                s.id === soalId ? { ...s, likes: s.likes - 1 } : s
             );
             setPopularSoals(prev => revertLikes(prev));
             setRecentSoals(prev => revertLikes(prev));
             
             // Remove from session storage
             const currentLiked = JSON.parse(sessionStorage.getItem('likedSoals') || '[]');
             sessionStorage.setItem('likedSoals', JSON.stringify(currentLiked.filter(id => id !== soalId)));
             
             showToast("Gagal menyukai soal.", "error");
        }
    };



    return (
        <div className="space-y-10 pb-12">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Selamat Datang, <span className="text-rose-600">Mahasiswa!</span>
                </h1>
                <p className="text-gray-500 text-lg">
                    Temukan dan unduh arsip soal untuk membantu belajar Anda.
                </p>
            </div>

            {/* Informasi Terbaru (Announcements) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Bell size={20} className="text-rose-500" />
                        Informasi Terbaru
                    </h2>
                    <button onClick={() => navigate('/news')} className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors">
                        Lihat Semua <ChevronRight size={16} />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {announcements.length > 0 ? announcements.map((item) => (
                        <div 
                            key={item.id}
                            className={`relative overflow-hidden bg-white p-5 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all group ${
                                item.color === 'blue' ? 'border-blue-500' : 'border-amber-500'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <h3 className="font-bold text-gray-800 group-hover:text-rose-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                    <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {item.date}
                                        </span>
                                        <span className="font-medium">• Berakhir: {item.expiry}</span>
                                    </div>
                                </div>
                                <span className={`self-start md:self-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 italic">Tidak ada pengumuman aktif.</p>
                    )}
                </div>
            </section>

            {/* Pencarian Cepat */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Search size={20} className="text-rose-500" />
                    Pencarian Cepat
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input 
                            type="text"
                            placeholder="Cari mata kuliah atau program studi..."
                            className="w-full pl-5 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <select className="appearance-none bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl pr-12 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer">
                                <option>Semua Jenis Ujian</option>
                                <option>UTS</option>
                                <option>UAS</option>
                                <option>Kuis</option>
                            </select>
                            <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-rose-100 transition-all active:scale-95"
                        >
                            <Search size={20} />
                            Cari
                        </button>
                    </div>
                </div>
            </section>

            {/* Grid Konten (Populer & Terbaru) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Soal Populer */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-1">
                        <Sparkles size={20} className="text-rose-500" />
                        Soal Populer
                    </h2>
                    <div className="space-y-4">
                        {popularSoals.map(soal => (
                            <div key={soal.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all space-y-3 md:space-y-4 group">
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-base md:text-lg group-hover:text-rose-600 transition-colors leading-tight mb-1">
                                                {soal.namaMatkul}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                                                <span className="font-medium text-rose-600">{soal.kodeMatkul}</span>
                                                <span>•</span>
                                                <span>{soal.jenisUjian}</span>
                                                <span>•</span>
                                                <span>{soal.semester}</span>
                                                <span>•</span>
                                                <span>{soal.tahunAjaran}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-1 rounded-lg shrink-0">
                                            <ThumbsUp size={14} fill="currentColor" />
                                            <span className="text-xs font-bold">{soal.likes}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs md:text-sm space-y-1">
                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                            <span className="text-gray-500">Prodi:</span>
                                            <span className="text-gray-900 font-medium">{soal.programStudi}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <button 
                                        onClick={() => handleDownload(soal.id, soal.file_url)}
                                        className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5 bg-rose-600 text-white text-xs font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95"
                                    >
                                        <Download size={14} /> 
                                        <span>Unduh</span>
                                    </button>

                                    <button 
                                        onClick={() => handleLike(soal.id)}
                                        className="px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg md:rounded-xl transition-colors active:scale-95"
                                    >
                                        <ThumbsUp size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Soal Terbaru */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-1">
                        <Clock size={20} className="text-rose-500" />
                        Soal Terbaru
                    </h2>
                    <div className="space-y-4">
                        {recentSoals.map(soal => (
                            <div key={soal.id} className="bg-white p-4 md:p-6 rounded-xl md:rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all space-y-3 md:space-y-4 group">
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-base md:text-lg group-hover:text-rose-600 transition-colors leading-tight mb-1">
                                                {soal.namaMatkul}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                                                <span className="font-medium text-rose-600">{soal.kodeMatkul}</span>
                                                <span>•</span>
                                                <span>{soal.jenisUjian}</span>
                                                <span>•</span>
                                                <span>{soal.semester}</span>
                                                <span>•</span>
                                                <span>{soal.tahunAjaran}</span>
                                            </div>
                                        </div>
                                        {soal.isNew && (
                                            <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shrink-0">Baru</span>
                                        )}
                                    </div>
                                    <div className="text-xs md:text-sm space-y-1">
                                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                                            <span className="text-gray-500">Prodi:</span>
                                            <span className="text-gray-900 font-medium">{soal.programStudi}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <button 
                                         onClick={() => handleDownload(soal.id, soal.file_url)}
                                         className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 md:py-2.5 bg-rose-600 text-white text-xs font-bold rounded-lg md:rounded-xl hover:bg-rose-700 transition-colors active:scale-95"
                                    >
                                        <Download size={14} /> 
                                        <span>Unduh</span>
                                    </button>

                                    <button 
                                        onClick={() => handleLike(soal.id)}
                                        className="px-3 md:px-4 py-2 md:py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg md:rounded-xl transition-colors active:scale-95"
                                    >
                                        <ThumbsUp size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
