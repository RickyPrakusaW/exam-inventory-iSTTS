const { Soal, Matkul, User, Prodi } = require('../models');
const { uploadFileToDrive } = require('../utils/googleDriveService');
const fs = require('fs');

const createSoal = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, type, year, matkul_id, uploader_id } = req.body;

        // 1. Upload to Google Drive (REMOVED - Local Storage now)
        // const driveResponse = await uploadFileToDrive(req.file);

        // 2. Delete local file after upload (REMOVED - We keep it)
        // fs.unlinkSync(req.file.path);

        // Construct local URL
        // Assuming server runs on localhost:5000 and mounts /uploads
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // 3. Save metadata to Database
        const newSoal = await Soal.create({
            title,
            type,
            year,
            matkul_id,
            uploader_id,
            file_url: fileUrl,
            drive_file_id: 'local-file', // Placeholder or remove field requirement
            status: 'Aktif'
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
                { 
                    model: Matkul, 
                    attributes: ['name', 'code', 'semester'],
                    include: [{ model: Prodi, attributes: ['name', 'fakultas'] }]
                },
                { model: User, attributes: ['name'] }
            ]
        });

        // Format data to match frontend expectation
        const formattedSoals = soals.map(soal => ({
            id: soal.id,
            namaMatkul: soal.Matkul ? soal.Matkul.name : 'Unknown',
            kodeMatkul: soal.Matkul ? soal.Matkul.code : 'Unknown',
            jenisUjian: soal.type,
            semester: soal.Matkul ? (soal.Matkul.semester % 2 !== 0 ? 'Ganjil' : 'Genap') : 'Unknown', // Derive generic semester type
            tahunAjaran: `${soal.year}/${soal.year + 1}`, // Logic assumption
            dosenPengampu: soal.User ? soal.User.name : 'Unknown',
            programStudi: soal.Matkul && soal.Matkul.Prodi ? soal.Matkul.Prodi.name : 'Unknown',
            fakultas: soal.Matkul && soal.Matkul.Prodi ? soal.Matkul.Prodi.fakultas : 'Unknown',
            downloads: soal.download_count,
            status: soal.status
        }));

        res.json(formattedSoals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    createSoal,
    getAllSoal
};
