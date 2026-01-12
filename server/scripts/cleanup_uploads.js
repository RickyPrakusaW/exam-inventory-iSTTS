const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load env vars first
const { Soals } = require('../models'); 
const db = require('../models');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

const cleanupUploads = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected.');

        // 1. Get all valid file filenames from DB
        const soals = await db.Soal.findAll({
            attributes: ['file_url']
        });

        const validFilenames = new Set();
        soals.forEach(soal => {
            if (soal.file_url) {
                // Extract filename from URL (e.g., http://localhost:5000/uploads/123-file.pdf -> 123-file.pdf)
                const parts = soal.file_url.split('/uploads/');
                if (parts.length > 1) {
                    validFilenames.add(parts[1]);
                }
            }
        });

        console.log(`Found ${validFilenames.size} valid files in database.`);

        // 2. Scan uploads directory
        if (!fs.existsSync(UPLOADS_DIR)) {
            console.error(`Uploads directory not found: ${UPLOADS_DIR}`);
            return;
        }

        const files = fs.readdirSync(UPLOADS_DIR);
        console.log(`Found ${files.length} files in uploads directory.`);

        let deletedCount = 0;
        let keptCount = 0;

        // 3. Delete orphans
        for (const file of files) {
            if (!validFilenames.has(file)) {
                // Extra safety: only delete PDFs (or expected extensions) to avoid deleting other assets if any
                if (file.toLowerCase().endsWith('.pdf')) {
                    fs.unlinkSync(path.join(UPLOADS_DIR, file));
                    console.log(`Deleted orphan: ${file}`);
                    deletedCount++;
                } else {
                    console.log(`Skipping non-pdf file (safety): ${file}`);
                }
            } else {
                keptCount++;
            }
        }

        console.log(`Cleanup complete.`);
        console.log(`- Kept: ${keptCount}`);
        console.log(`- Deleted: ${deletedCount}`);

    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await db.sequelize.close();
    }
};

cleanupUploads();
