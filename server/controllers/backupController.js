const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const AdmZip = require('adm-zip');
const { Sequelize } = require('sequelize');
// Import models dynamically or manually if needed
// const db = require('../models'); 

// Placeholder for Token Storage - In a real app, use a DB table. Use a simple file for now as per plan constraints/simplicity.
const TOKEN_PATH = path.join(__dirname, '../config/google_token.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const getOAuthClient = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
};

const saveToken = (tokens) => {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
};

const loadToken = () => {
    if (fs.existsSync(TOKEN_PATH)) {
        return JSON.parse(fs.readFileSync(TOKEN_PATH));
    }
    return null;
};

exports.getAuthUrl = (req, res) => {
    const oAuth2Client = getOAuthClient();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.json({ url: authUrl });
};

exports.oauthCallback = async (req, res) => {
    const { code } = req.body;
    const oAuth2Client = getOAuthClient();
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        saveToken(tokens);
        res.json({ success: true, message: 'Google Drive connected successfully' });
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).json({ success: false, message: 'Failed to connect to Google Drive' });
    }
};

exports.isConnected = (req, res) => {
    const tokens = loadToken();
    res.json({ connected: !!tokens });
};

exports.performBackup = async (req, res) => {
    try {
        console.log('Starting backup process...');
        const tokens = loadToken();
        if (!tokens) {
            console.error('No tokens found');
            return res.status(401).json({ message: 'Google Drive not connected' });
        }

        const oAuth2Client = getOAuthClient();
        oAuth2Client.setCredentials(tokens);
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const backupDir = path.join(__dirname, '../backup_temp');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const dbDumpPath = path.join(backupDir, 'db_dump');
        if (!fs.existsSync(dbDumpPath)) fs.mkdirSync(dbDumpPath, { recursive: true });

        // 1. Export DB
        console.log('Exporting database...');
        const db = require('../models'); // Assuming index.js exports db with models
        const modelNames = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');
        
        for (const modelName of modelNames) {
            try {
                if(typeof db[modelName].findAll === 'function') {
                    const data = await db[modelName].findAll();
                    fs.writeFileSync(path.join(dbDumpPath, `${modelName}.json`), JSON.stringify(data, null, 2));
                }
            } catch (dbError) {
                console.error(`Failed to export model ${modelName}:`, dbError.message);
            }
        }
        console.log('Database export complete.');

        // 2. Zip uploads and db dump
        console.log('Creating zip archive...');
        const zipPath = path.join(backupDir, `backup_${Date.now()}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                console.warn('Archiver warning:', err);
            } else {
                throw err;
            }
        });
        
        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);
        archive.directory(dbDumpPath, 'db_dump');
        
        const uploadsPath = path.join(__dirname, '../public/uploads');
        if (fs.existsSync(uploadsPath)) {
            archive.directory(uploadsPath, 'uploads');
        } else {
            console.warn('Uploads directory not found, skipping uploads backup.');
        }
        
        await archive.finalize();

        // Wait for file to be closed
        await new Promise((resolve, reject) => {
            output.on('close', resolve);
            output.on('error', reject);
        });
        console.log('Zip archive created at:', zipPath, 'Size:', fs.statSync(zipPath).size);

        // 3. Upload to Drive
        console.log('Uploading to Google Drive...');
        const fileMetadata = {
            name: path.basename(zipPath),
            // parents: ['appDataFolder'] // Removed to allows user visibility in Root Drive
        };
        
        const media = {
            mimeType: 'application/zip',
            body: fs.createReadStream(zipPath),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        console.log('Upload complete. File ID:', file.data.id);

        // Cleanup
        console.log('Cleaning up temporary files...');
        fs.unlinkSync(zipPath);
        fs.rmSync(dbDumpPath, { recursive: true, force: true });

        res.json({ success: true, message: 'Backup created successfully', fileId: file.data.id });

    } catch (error) {
        console.error('Backup error/trace:', error);
        res.status(500).json({ message: 'Backup failed', error: error.message });
    }
};

exports.listBackups = async (req, res) => {
    try {
        const tokens = loadToken();
        if (!tokens) return res.status(401).json({ message: 'Not connected' });

        const oAuth2Client = getOAuthClient();
        oAuth2Client.setCredentials(tokens);
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const response = await drive.files.list({
            q: "mimeType='application/zip' and name contains 'backup_'",
            fields: 'files(id, name, createdTime, size)',
            orderBy: 'createdTime desc'
        });

        res.json({ success: true, files: response.data.files });
    } catch (error) {
        console.error('List error:', error);
        res.status(500).json({ message: 'Failed to list backups' });
    }
};

exports.restoreBackup = async (req, res) => {
    const { fileId } = req.params;
    try {
        const tokens = loadToken();
        if (!tokens) return res.status(401).json({ message: 'Not connected' });

        const oAuth2Client = getOAuthClient();
        oAuth2Client.setCredentials(tokens);
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const backupDir = path.join(__dirname, '../backup_temp');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
        
        const zipPath = path.join(backupDir, 'restore.zip');
        const dest = fs.createWriteStream(zipPath);

        const response = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        response.data
            .on('end', async () => {
                try {
                    // Extract
                    const zip = new AdmZip(zipPath);
                    zip.extractAllTo(backupDir, true);

                    // Restore Uploads
                   // Note: This replaces the entire directory. 
                   // Ideally we should maybe clear existing uploads first? 
                   // Or just overwrite. Overwrite is safer than delete+write if something fails mid-way.
                   // But "restore" usually implies "state at that time".
                   // Let's clear target upload dir first or just move it to a temporary trash.
                   
                    const uploadsSrc = path.join(backupDir, 'uploads');
                    const uploadsDest = path.join(__dirname, '../public/uploads');

                    if (fs.existsSync(uploadsSrc)) {
                         // Simple strategy: Sync files. 
                         // For true restore: Delete current uploads, move new uploads in.
                         fs.rmSync(uploadsDest, { recursive: true, force: true });
                         fs.renameSync(uploadsSrc, uploadsDest);
                    }

                    // Restore DB
                    const db = require('../models');
                    const dbDumpPath = path.join(backupDir, 'db_dump');
                    if (fs.existsSync(dbDumpPath)) {
                        const files = fs.readdirSync(dbDumpPath);
                        
                        // Disable Foreign Key checks?
                        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
                        
                        for (const file of files) {
                            if (!file.endsWith('.json')) continue;
                            const modelName = file.replace('.json', '');
                            if (db[modelName]) {
                                const data = JSON.parse(fs.readFileSync(path.join(dbDumpPath, file)));
                                await db[modelName].destroy({ truncate: true, cascade: true }); // Clear table
                                await db[modelName].bulkCreate(data);
                            }
                        }
                        
                        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
                    }

                    // Cleanup
                    fs.unlinkSync(zipPath);
                    // fs.rmSync(dbDumpPath, { recursive: true, force: true }); // Already moved or deleted? 
                    // Actually we extracted to backupDir which has headers 'db_dump' and 'uploads'.
                    // We moved 'uploads' so 'db_dump' is still there.
                    fs.rmSync(backupDir, { recursive: true, force: true });

                    res.json({ success: true, message: 'Restore completed successfully' });

                } catch (err) {
                    console.error('Restore processing error:', err);
                    res.status(500).json({ message: 'Restore processing failed', error: err.message });
                }
            })
            .on('error', (err) => {
                console.error('Download error:', err);
                res.status(500).json({ message: 'Download failed', error: err.message });
            })
            .pipe(dest);

    } catch (error) {
        console.error('Restore init error:', error);
        res.status(500).json({ message: 'Restore initialization failed', error: error.message });
    }
};
