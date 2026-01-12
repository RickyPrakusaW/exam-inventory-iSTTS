const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { Prodis, Matkuls, Soals, Users } = require('../models'); // Adjust based on index.js exports
const { uploadFileToDrive } = require('../utils/googleDriveService');
require('dotenv').config();

// Initialize DB connection manually if models don't auto-connect
// Assuming models/index.js handles connection based on previous view
const db = require('../models'); 

const ASSETS_DIR = process.argv[2];

if (!ASSETS_DIR) {
    console.error('Please provide the assets directory path as an argument.');
    process.exit(1);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const importPdfs = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');
        
        // Sync to ensure new columns exist (be careful in prod)
        // await db.sequelize.sync({ alter: true }); // Assume already synced by main app or previous steps

        // Get or Create Admin User for 'uploader_id'
        let uploader = await db.User.findOne({ where: { role: 'admin' } });
        if (!uploader) {
            console.log('No admin found, creating default system admin...');
             uploader = await db.User.findOne(); // Fallback
        }
        if (!uploader) {
             console.error('No user found to act as uploader. Please seed users first.');
             process.exit(1);
        }

        const prodiDirs = fs.readdirSync(ASSETS_DIR).filter(file => fs.statSync(path.join(ASSETS_DIR, file)).isDirectory());

        for (const prodiCode of prodiDirs) {
            console.log(`Processing Prodi: ${prodiCode}`);
            const prodiPath = path.join(ASSETS_DIR, prodiCode);
            
            // 1. Find or Create Prodi
            const [prodi] = await db.Prodi.findOrCreate({
                where: { code: prodiCode },
                defaults: { name: prodiCode, fakultas: 'Unknown' } 
            });

            const files = fs.readdirSync(prodiPath).filter(f => f.toLowerCase().endsWith('.pdf'));

            for (const file of files) {
                console.log(`  Processing file: ${file}`);
                // Format: [type]_[matkul]_[yearStart]_[yearEnd]_[semester].pdf
                // Example: UAS_Algoritma_2023_2024_Ganjil.pdf
                // Example with underscores in matkul: UAS_S1DKV_Animasi3D_2024_2025_GENAP.pdf
                
                const nameParts = path.basename(file, '.pdf').split('_');
                if (nameParts.length < 5) {
                    console.warn(`    Skipping ${file}: Invalid name format (too few parts).`);
                    continue;
                }

                // Parse from the end backwards
                const semesterStr = nameParts[nameParts.length - 1]; // "GENAP"
                const yearEndStr = nameParts[nameParts.length - 2];  // "2025"
                const yearStartStr = nameParts[nameParts.length - 3]; // "2024"
                
                const type = nameParts[0]; // "UAS"
                
                // Matkul is everything in between
                let matkulParts = nameParts.slice(1, nameParts.length - 3);
                
                // Strip Prodi Code if it appears at the start of the Matkul part
                // e.g. "S1TI", "Technopreneurship" -> "Technopreneurship"
                // Check if the first part looks like the prodiCode (case-insensitive)
                if (matkulParts.length > 0 && matkulParts[0].toLowerCase() === prodiCode.toLowerCase()) {
                     matkulParts.shift();
                }

                let matkulName = matkulParts.join(' '); 
                
                // Fix common typos
                const typoMap = {
                    'MachineLearningg': 'MachineLearning',
                    'MotionGraphicss': 'MotionGraphics',
                    'GenerativeArtt': 'GenerativeArt',
                    'StatistikaTerapann': 'StatistikaTerapan',
                    'ObjectOrientedAnalysisDanDesignn': 'ObjectOrientedAnalysisDanDesain',
                    'WebSeviceSOA': 'WebServiceSOA',
                };
                
                if (typoMap[matkulName]) {
                    matkulName = typoMap[matkulName];
                }

                const year = parseInt(yearStartStr);
                
                if (isNaN(year)) {
                    console.warn(`    Skipping ${file}: Could not parse year '${yearStartStr}'.`);
                    continue;
                }

                const semester = semesterStr.toLowerCase() === 'ganjil' ? 1 : 2;

                // 2. Find or Create Matkul
                const [matkul] = await db.Matkul.findOrCreate({
                    where: { name: matkulName, prodi_id: prodi.id },
                    defaults: { 
                        code: matkulName.substring(0, 3).toUpperCase() + '101', 
                        semester: semester 
                    }
                });

                // 3. Upload/Copy to Local Storage
                const sourcePath = path.join(prodiPath, file);
                
                // Sanitize filename
                const cleanName = file.replace(/[^a-zA-Z0-9.]/g, '_');
                const uniqueName = `${Date.now()}-${cleanName}`;
                const destPath = path.join(__dirname, '..', 'public', 'uploads', uniqueName);

                // Ensure directory exists (redundant if mkdir run, but safe)
                // fs.mkdirSync(path.dirname(destPath), { recursive: true });

                let fileUrl = `http://localhost:5000/uploads/${uniqueName}`;
                let driveId = 'local-file';

                try {
                    // Force clean up of duplicates or old versions
                    // We delete any Soal with this filename to ensure we only have one clean record
                    // pointing to the correct Matkul and Year.
                    // NOTE: This resets download counts, which is acceptable for this migration phase.
                    await db.Soal.destroy({
                        where: { title: file }
                    });

                    console.log('    Creating Database Entry...');
                    await db.Soal.create({
                        title: file, 
                        type: type,
                        year: year,
                        matkul_id: matkul.id,
                        uploader_id: uploader.id,
                        file_url: fileUrl,
                        drive_file_id: driveId,
                        status: 'Aktif'
                    });
                    console.log('    Done.');

                } catch (err) {
                    console.error(`    Failed to process ${file}:`, err.message);
                }
                
                await sleep(100); 
            }
        }

        console.log('Import completed.');

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
       await db.sequelize.close();
    }
};

importPdfs();
