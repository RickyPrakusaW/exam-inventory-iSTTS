const { Soal, Matkul, User, Prodi } = require('../models');
const { uploadFileToDrive } = require('../utils/googleDriveService');
const fs = require('fs');
const path = require('path');
// [NEW] Helper for cleaning up empty folders
const deleteFolderRecursive = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        if (fs.readdirSync(folderPath).length === 0) {
            fs.rmdirSync(folderPath);
            // Recursively check parent
            const parentPath = path.dirname(folderPath);
            // Stop at 'uploads' to avoid deleting root uploads or public
            if (parentPath.includes('uploads') && !parentPath.endsWith('uploads')) {
                 deleteFolderRecursive(parentPath);
            }
        }
    }
};

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
        // Use path.relative to get path relative to 'public' folder
        // req.file.path is absolute or relative to run location
        // We assume 'public' is serving static files
        const relativePath = path.relative(path.join(__dirname, '../public'), req.file.path);
        // Replace backslashes with forward slashes for URL
        const fileUrl = `${req.protocol}://${req.get('host')}/${relativePath.replace(/\\/g, '/')}`;

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
            title: soal.title, // Include title
            matkul_id: soal.matkul_id, // Include matkul_id
            namaMatkul: soal.Matkul ? soal.Matkul.name : 'Unknown',
            kodeMatkul: soal.Matkul ? soal.Matkul.code : 'Unknown',
            jenisUjian: soal.type,
            semester: soal.Matkul ? (soal.Matkul.semester % 2 !== 0 ? 'Ganjil' : 'Genap') : 'Unknown', // Derive generic semester type
            tahunAjaran: `${soal.year}/${soal.year + 1}`, // Logic assumption
            dosenPengampu: soal.User ? soal.User.name : 'Unknown',
            programStudi: soal.Matkul && soal.Matkul.Prodi ? soal.Matkul.Prodi.name : 'Unknown',
            fakultas: soal.Matkul && soal.Matkul.Prodi ? soal.Matkul.Prodi.fakultas : 'Unknown',
            downloads: soal.download_count,
            status: soal.status,
            file_url: soal.file_url
        }));

        res.json(formattedSoals);
    } catch (error) {
        console.error(error);
    }
};

const updateSoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, year, matkul_id, status, 
            // New metadata for moving files if needed
            matkul_name, prodi_name, prodi_code, semester_num 
        } = req.body;
        
        const soal = await Soal.findByPk(id);
        if (!soal) {
            return res.status(404).json({ message: 'Soal not found' });
        }

        let fileUrl = soal.file_url;
        
        // Handle file replacement
        if (req.file) {
            // New file upload - clean up old file
            const oldFilename = soal.file_url.split('/uploads/')[1];
            if (oldFilename) {
                 try {
                     // Need to handle both old flat files and new nested files
                     // Simplified approach: try to find and delete
                     // Since we don't store absolute path, we reconstruct or search?
                     // Actually, if we use standard path access via url, let's try to decode it.
                     // But simpler: just try to delete if we can map URL to path.
                     
                     // NOTE: With new nested structure, simple split might return "Prodi/Year/Sem/File.pdf"
                     // So we join it with uploadDir
                     const uploadDir = path.join(__dirname, '../public/uploads');
                     const oldPath = path.join(uploadDir, oldFilename);
                     
                     if (fs.existsSync(oldPath)) {
                         fs.unlinkSync(oldPath);
                         // cleanup folders
                         deleteFolderRecursive(path.dirname(oldPath));
                     }
                 } catch (e) {
                     console.error("Failed to delete old file", e);
                 }
            }
            
            // New file path is already set by middleware
            // Relative path for URL: uploads/...
            // The middleware `destination` sets the full path, `filename` sets the name.
            // `req.file.path` is the full absolute path.
            // We need relative path for `file_url`
            
            // We can construct it from `req.file.destination` relative to public
            const relativePath = path.relative(path.join(__dirname, '../public'), req.file.path);
             // Ensure forward slashes for URL
            fileUrl = `${req.protocol}://${req.get('host')}/${relativePath.replace(/\\/g, '/')}`;

        } else if (fileUrl && (title !== soal.title || type !== soal.type || year !== soal.year || matkul_id !== soal.matkul_id)) {
            // [NEW] Logic to move file if metadata changes but no new file uploaded
            // Verify we have enough info to reconstruct new path
            if (matkul_name && prodi_name && prodi_code && semester_num) {
                 try {
                    const uploadDir = path.join(__dirname, '../public/uploads');
                    // 1. Locate old file
                    const oldRelPath = soal.file_url.split(req.get('host') + '/')[1]; // public/uploads/... or uploads/...
                    // Wait, fileUrl in DB is typically `http://host/uploads/filename`
                    // Let's parse it safely
                    const oldUrlPath = new URL(soal.file_url).pathname; // /uploads/...
                    const oldFsPath = path.join(__dirname, '../public', oldUrlPath); 

                    if (fs.existsSync(oldFsPath)) {
                        // 2. Construct new path
                        const semesterType = semester_num % 2 !== 0 ? 'Semester_Gasal' : 'Semester_Genap';
                        const schoolYear = `${year}-${parseInt(year) + 1}`;
                        const safeProdi = prodi_name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
                        
                        const targetDir = path.join(uploadDir, safeProdi, schoolYear, semesterType);
                        if (!fs.existsSync(targetDir)) {
                            fs.mkdirSync(targetDir, { recursive: true });
                        }

                        const toUpperCamelCase = (str) => {
                            return str.replace(/[^a-zA-Z0-9 ]/g, '').split(' ')
                                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
                        };
                        const safeMatkul = toUpperCamelCase(matkul_name);
                        const fileYear = `${year}_${parseInt(year) + 1}`; // For filename
                        const semTypeFile = semester_num % 2 !== 0 ? 'GANJIL' : 'GENAP';
                        const ext = path.extname(oldFsPath);
                        
                        const newFilename = `${type}_${prodi_code}_${safeMatkul}_${fileYear}_${semTypeFile}${ext}`;
                        const newFsPath = path.join(targetDir, newFilename);

                        // 3. Move/Rename
                        if (oldFsPath !== newFsPath) {
                            fs.renameSync(oldFsPath, newFsPath);
                            
                            // 4. Update URL
                            const relativePath = path.relative(path.join(__dirname, '../public'), newFsPath);
                            fileUrl = `${req.protocol}://${req.get('host')}/${relativePath.replace(/\\/g, '/')}`;
                            
                            // 5. Cleanup old folder
                            deleteFolderRecursive(path.dirname(oldFsPath));
                        }
                    }
                 } catch (e) {
                     console.error("Error moving file on edit:", e);
                     // Non-blocking, proceed with DB update
                 }
            }
        }

        await soal.update({
            title,
            type,
            year,
            matkul_id,
            status,
            file_url: fileUrl
        });

        res.json({ message: 'Soal updated successfully', data: soal });

    } catch (error) {
        console.error(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteSoal = async (req, res) => {
    try {
        const { id } = req.params;
        const soal = await Soal.findByPk(id);
        
        if (!soal) {
            return res.status(404).json({ message: 'Soal not found' });
        }

        // Try to delete file
        if (soal.file_url) {
             try {
                 const uploadDir = path.join(__dirname, '../public/uploads');
                 // Handle standard and nested paths
                 // URL: .../uploads/filename or .../uploads/Nested/Path/filename
                 if (soal.file_url.includes('/uploads/')) {
                     // Get everything after /uploads/
                     const parts = soal.file_url.split('/uploads/');
                     if (parts.length > 1) {
                         const relativePath = decodeURIComponent(parts[1]); // decode for spaces etc
                         const filePath = path.join(uploadDir, relativePath);
                         
                         if (fs.existsSync(filePath)) {
                             fs.unlinkSync(filePath);
                             // [NEW] Clean up folders
                             deleteFolderRecursive(path.dirname(filePath));
                         }
                     }
                 }
             } catch (e) {
                 console.error("Error deleting file:", e);
             }
        }

        await soal.destroy();
        res.json({ message: 'Soal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    createSoal,
    getAllSoal,
    updateSoal,
    deleteSoal
};
