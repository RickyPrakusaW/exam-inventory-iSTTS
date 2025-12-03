import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, Download, ThumbsUp } from 'lucide-react';

const Home = () => {
    const [soals, setSoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSoals();
    }, []);

    const fetchSoals = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/soal`);
            setSoals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching soals:', error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Temukan Referensi <span className="text-blue-600">Soal Ujian</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Akses ribuan arsip soal UTS, UAS, dan Kuis dari berbagai program studi untuk persiapan ujian yang lebih baik.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative mt-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="Cari mata kuliah, dosen, atau tahun..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data soal...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {soals.map((soal) => (
                        <div key={soal.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {soal.type} {soal.year}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {soal.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">{soal.Matkul?.name || 'Mata Kuliah Umum'}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Download className="w-4 h-4" /> {soal.download_count || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="w-4 h-4" /> {soal.upvote_count || 0}
                                    </span>
                                </div>
                                <a
                                    href={soal.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
