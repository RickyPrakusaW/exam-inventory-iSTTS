const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists relative to project root
// Going up from server/middleware/ to server/public/uploads
const uploadDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Store files in 'public/uploads' directory with structured folders
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // [NEW] Construct specific path
        const { prodi_name, year, semester_num } = req.body;
        
        let targetDir = uploadDir; // Default to uploads if info missing

        if (prodi_name && year && semester_num) {
            const semesterType = semester_num % 2 !== 0 ? 'Semester_Gasal' : 'Semester_Genap';
            // Folder structure: [Prodi Name]/[School Year (YYYY-YYYY)]/Semester_[Gasal/Genap]/
            // Year from body is single year e.g. 2024. Format YYYY-YYYY e.g. 2024-2025
            const schoolYear = `${year}-${parseInt(year) + 1}`;
            
            // Sanitize folder names to avoid path issues
            const safeProdi = prodi_name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
            
            targetDir = path.join(uploadDir, safeProdi, schoolYear, semesterType);
        }

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        // [NEW] Construct standardized filename
        // Format: [Soal Type]_[Prodi Code]_[Matkul name (in UpperCamelCase)]_[School Year (YYYY_YYYY)]_[GENAP/GANJIL].pdf
        const { type, prodi_code, matkul_name, year, semester_num } = req.body;

        if (type && prodi_code && matkul_name && year && semester_num) {
             const toUpperCamelCase = (str) => {
                return str
                    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special chars
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join('');
            };

            const safeMatkul = toUpperCamelCase(matkul_name);
            const schoolYear = `${year}_${parseInt(year) + 1}`;
            const semesterType = semester_num % 2 !== 0 ? 'GANJIL' : 'GENAP';
            
            const ext = path.extname(file.originalname);
            const newFilename = `${type}_${prodi_code}_${safeMatkul}_${schoolYear}_${semesterType}${ext}`;
            
            cb(null, newFilename);
        } else {
             // Fallback to timestamp if metadata missing
            const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            cb(null, `${Date.now()}-${cleanName}`);
        }
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

module.exports = upload;
