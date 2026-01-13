const { Soal, User, DownloadHistory, Laporan, Matkul, Prodi } = require('../models');
const exceljs = require('exceljs');
const { Op } = require('sequelize');

exports.exportData = async (req, res) => {
    try {
        const { type, start_date, end_date, format } = req.query;
        
        let workbook = new exceljs.Workbook();
        let worksheet = workbook.addWorksheet('Data');
        
        // Date filtering
        let dateField = 'createdAt';
        if (type === 'unduhan') {
            dateField = 'downloaded_at';
        }

        let dateFilter = {};
        if (start_date && end_date) {
            dateFilter = {
                [dateField]: {
                    [Op.between]: [new Date(start_date), new Date(end_date + 'T23:59:59')]
                }
            };
        } else if (start_date) {
            dateFilter = {
                 [dateField]: {
                    [Op.gte]: new Date(start_date)
                }
            };
        } else if (end_date) {
             dateFilter = {
                 [dateField]: {
                    [Op.lte]: new Date(end_date + 'T23:59:59')
                }
            };
        }

        if (type === 'soal') {
            const data = await Soal.findAll({
                where: dateFilter,
                include: [
                    { model: User, as: 'Uploader', attributes: ['name', 'email'] },
                    { model: Matkul, include: [{ model: Prodi }] }
                ],
                order: [['createdAt', 'DESC']]
            });

            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Judul', key: 'title', width: 30 },
                { header: 'Tipe', key: 'type', width: 15 },
                { header: 'Tahun', key: 'year', width: 10 },
                { header: 'Mata Kuliah', key: 'matkul', width: 25 },
                { header: 'Prodi', key: 'prodi', width: 25 },
                { header: 'Semester', key: 'semester', width: 10 },
                { header: 'Uploader', key: 'uploader', width: 20 },
                { header: 'Status', key: 'status', width: 10 },
                { header: 'Tanggal Upload', key: 'created_at', width: 20 }
            ];

            data.forEach(item => {
                worksheet.addRow({
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    year: item.year,
                    matkul: item.Matkul?.name || '-',
                    prodi: item.Matkul?.Prodi?.name || '-',
                    semester: item.Matkul?.semester || '-',
                    uploader: item.Uploader?.name || 'Unknown',
                    status: item.status,
                    created_at: item.createdAt
                });
            });


        } else if (type === 'unduhan') {
             const data = await DownloadHistory.findAll({
                where: dateFilter,
                include: [
                    { model: User, attributes: ['name', 'email', 'nrp'] },
                    { model: Soal, attributes: ['title', 'type'], include: [{model: Matkul, attributes:['name']}] }
                ],
                order: [['downloaded_at', 'DESC']]
            });

            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'User', key: 'user_name', width: 25 },
                { header: 'NRP', key: 'user_nrp', width: 15 },
                { header: 'Soal', key: 'soal_title', width: 30 },
                { header: 'Tipe Soal', key: 'soal_type', width: 15 },
                { header: 'Matkul', key: 'matkul_name', width: 25 },
                { header: 'Waktu Unduh', key: 'downloaded_at', width: 20 }
            ];

            data.forEach(item => {
                worksheet.addRow({
                    id: item.id,
                    user_name: item.User?.name || 'Unknown',
                    user_nrp: item.User?.nrp || '-',
                    soal_title: item.Soal?.title || 'Deleted Soal',
                    soal_type: item.Soal?.type || '-',
                    matkul_name: item.Soal?.Matkul?.name || '-',
                    downloaded_at: item.downloaded_at
                });
            });

        } else if (type === 'laporan') {
             const data = await Laporan.findAll({
                where: dateFilter,
                include: [
                     { model: User, attributes: ['name', 'nrp'] },
                     { model: Soal, attributes: ['title'] }
                ],
                order: [['createdAt', 'DESC']]
            });

            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Pelapor', key: 'reporter_name', width: 25 },
                { header: 'NRP', key: 'reporter_nrp', width: 15 },
                { header: 'Soal', key: 'soal_title', width: 30 },
                { header: 'Jenis Laporan', key: 'jenis', width: 20 },
                { header: 'Alasan', key: 'reason', width: 40 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Waktu Lapor', key: 'created_at', width: 20 }
            ];

            data.forEach(item => {
                worksheet.addRow({
                    id: item.id,
                    reporter_name: item.User?.name || 'Unknown',
                    reporter_nrp: item.User?.nrp || '-',
                    soal_title: item.Soal?.title || 'Deleted Soal',
                    jenis: item.jenis,
                    reason: item.reason,
                    status: item.status,
                    created_at: item.createdAt
                });
            });
        } else {
             return res.status(400).json({ message: 'Invalid export type' });
        }

        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=export_${type}_${Date.now()}.csv`);
            await workbook.csv.write(res);
        } else {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=export_${type}_${Date.now()}.xlsx`);
            await workbook.xlsx.write(res);
        }
        
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Failed to export data' });
    }
};

exports.getExportStats = async (req, res) => {
    try {
        const soalCount = await Soal.count();
        const mahasiswaCount = await User.count({ where: { role: 'mahasiswa' } });
        const unduhanCount = await DownloadHistory.count();
        const laporanCount = await Laporan.count();

        res.status(200).json({
            soal: soalCount,
            mahasiswa: mahasiswaCount,
            unduhan: unduhanCount,
            laporan: laporanCount
        });
    } catch (error) {
        console.error('Error fetching export stats:', error);
        res.status(500).json({ message: 'Failed to fetch export stats' });
    }
};
