import { useState } from 'react';
import { Upload, File, X, CheckCircle, Download } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'UTS',
        year: new Date().getFullYear(),
        matkul_id: '',
    });

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/soal`);
            const data = response.data.map(item => ({
                Judul: item.title,
                'Mata Kuliah': item.Matkul?.name || '-',
                Tipe: item.type,
                Tahun: item.year,
                'Diunduh': item.download_count,
                'Link File': item.file_url
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan Bank Soal");
            XLSX.writeFile(wb, "Laporan_Bank_Soal.xlsx");
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengunduh laporan");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Pilih file PDF terlebih dahulu');

        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('title', formData.title);
        data.append('type', formData.type);
        data.append('year', formData.year);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/soal`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Upload Berhasil!');
            setFile(null);
            setFormData({ ...formData, title: '' });
        } catch (error) {
            console.error(error);
            alert('Upload Gagal: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export Laporan (.xlsx)
                    </button>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        System Operational
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-blue-600" />
                            Upload Soal Baru
                        </h2>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Soal</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Contoh: UTS Pemrograman Web 2023"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Ujian</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="UTS">UTS</option>
                                        <option value="UAS">UAS</option>
                                        <option value="Kuis">Kuis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* File Drop Zone */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {file ? (
                                    <div className="flex items-center justify-center gap-2 text-blue-600">
                                        <File className="w-6 h-6" />
                                        <span className="font-medium">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setFile(null); }}
                                            className="p-1 hover:bg-blue-100 rounded-full z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-blue-600">Klik untuk upload</span> atau drag and drop
                                        </p>
                                        <p className="text-xs text-gray-400">PDF up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className={`w-full py-2.5 rounded-lg font-medium text-white transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {uploading ? 'Mengupload...' : 'Simpan ke Arsip'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Stats / Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Statistik Singkat</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Total Soal</span>
                                <span className="font-bold text-gray-900">1,240</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Download Hari Ini</span>
                                <span className="font-bold text-gray-900">85</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Laporan Baru</span>
                                <span className="font-bold text-red-600">3</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
