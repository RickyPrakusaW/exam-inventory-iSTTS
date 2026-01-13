const { Laporan, User, Soal, Matkul } = require('../models');

exports.createReport = async (req, res) => {
    try {
        const { userId, soalId, reason, jenis } = req.body;

        if (!userId || !soalId || !reason || !jenis) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newReport = await Laporan.create({
            reporter_id: userId,
            soal_id: soalId,
            reason,
            jenis, // Assuming 'jenis' is a field in Laporan model based on new requirements, need to verify model first or update it.
            // Wait, looking at previous view_file of Laporan.js, it only had 'reason' and 'status'.
            // The UI in LaporanMahasiswa showed 'jenis' (e.g., Soal Rusak).
            // I should probably update the Laporan model to include 'jenis' first.
            status: 'pending'
        });

        res.status(201).json({ message: 'Laporan berhasil dibuat', data: newReport });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Laporan.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email'] // Adjust based on User model
                },
                {
                    model: Soal,
                    include: [
                        {
                            model: Matkul,
                            attributes: ['name', 'code']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await Laporan.findByPk(id);
        if (!report) {
            return res.status(404).json({ message: 'Laporan not found' });
        }

        report.status = status;
        await report.save();

        res.status(200).json({ message: 'Status laporan updated', data: report });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
