const { Soal, Matkul, User } = require('../models');
const { uploadFileToDrive } = require('../utils/googleDriveService');
const fs = require('fs');

const createSoal = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, type, year, matkul_id, uploader_id } = req.body;

        // 1. Upload to Google Drive
        const driveResponse = await uploadFileToDrive(req.file);

        // 2. Delete local file after upload
        fs.unlinkSync(req.file.path);

        // 3. Save metadata to Database
        const newSoal = await Soal.create({
            title,
            type,
            year,
            matkul_id,
            uploader_id,
            file_url: driveResponse.webViewLink,
            drive_file_id: driveResponse.id,
        });

        res.status(201).json({
            message: 'Soal uploaded successfully',
            data: newSoal,
        });
    } catch (error) {
        console.error(error);
        // Cleanup local file if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const getAllSoal = async (req, res) => {
    try {
        const soals = await Soal.findAll({
            include: [
                { model: Matkul, attributes: ['name'] },
                { model: User, attributes: ['name'] }
            ]
        });
        res.json(soals);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    createSoal,
    getAllSoal
};
