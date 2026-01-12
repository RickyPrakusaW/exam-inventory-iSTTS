const { Soal, User, Laporan, Matkul, Prodi } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Stats Cards
        const totalSoal = await Soal.count({ where: { status: 'Aktif' } });
        const mahasiswaCount = await User.count({ where: { role: 'mahasiswa' } });
        const totalDownloads = await Soal.sum('download_count') || 0;
        const laporanCount = await Laporan.count({ where: { status: 'pending' } });

        // 2. Popular Soals (Top 5 by downloads)
        const popularSoalsRaw = await Soal.findAll({
            where: { status: 'Aktif' },
            order: [['download_count', 'DESC']],
            limit: 5,
            include: [
                {
                    model: Matkul,
                    include: [{ model: Prodi }]
                }
            ]
        });

        const popularSoals = popularSoalsRaw.map(soal => {
            const semesterNum = soal.Matkul?.semester;
            const semesterStr = semesterNum ? (semesterNum % 2 !== 0 ? 'Ganjil' : 'Genap') : '-';
            
            return {
                id: soal.id,
                namaMatkul: soal.Matkul?.name || 'Unknown',
                kodeMatkul: soal.Matkul?.code || 'Unknown',
                jenisUjian: soal.type,
                semester: semesterStr,
                tahunAjaran: soal.year,
                programStudi: soal.Matkul?.Prodi?.name || 'Unknown',
                fakultas: soal.Matkul?.Prodi?.fakultas || 'Unknown', 
                downloads: soal.download_count
            };
        });

        // 3. Recent Activities
        // Fetch recent uploads
        const recentUploads = await Soal.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Matkul }]
        });

        // Fetch recent user registrations
        const recentUsers = await User.findAll({
            where: { role: 'mahasiswa' },
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        // Merge and sort
        const activities = [
            ...recentUploads.map(soal => ({
                id: `upload-${soal.id}`,
                title: `Soal ${soal.Matkul?.name || 'Unknown'} ditambahkan`,
                time: soal.createdAt,
                type: 'upload',
                originalTime: new Date(soal.createdAt)
            })),
            ...recentUsers.map(user => ({
                id: `user-${user.id}`,
                title: `Mahasiswa baru terdaftar: ${user.name}`,
                time: user.createdAt,
                type: 'user',
                originalTime: new Date(user.createdAt)
            }))
        ]
        .sort((a, b) => b.originalTime - a.originalTime)
        .slice(0, 5);

        res.json({
            stats: {
                totalSoal,
                mahasiswaCount,
                totalDownloads,
                laporanCount
            },
            popularSoals,
            recentActivities: activities,
            activeNews: [] // Placeholder for now
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};
