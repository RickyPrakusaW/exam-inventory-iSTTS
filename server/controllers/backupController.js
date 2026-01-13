const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const AdmZip = require('adm-zip');

// Placeholder for Token Storage
const TOKEN_PATH = path.join(__dirname, '../config/google_token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive']; // Need full drive access to manage folders/files easier or drive.file

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

// --- Helper Functions for Drive Operations ---

async function createFolder(drive, name, parentId = null) {
    const fileMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
    };
    if (parentId) {
        fileMetadata.parents = [parentId];
    }
    const file = await drive.files.create({
        resource: fileMetadata,
        fields: 'id',
    });
    return file.data.id;
}

async function uploadFile(drive, filePath, name, parentId = null, mimeType = null) {
    const fileMetadata = {
        name: name,
    };
    if (parentId) {
        fileMetadata.parents = [parentId];
    }
    const media = {
        mimeType: mimeType || 'application/octet-stream',
        body: fs.createReadStream(filePath),
    };
    const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });
    return file.data.id;
}

async function uploadFolderRecursive(drive, localPath, parentId) {
    const items = fs.readdirSync(localPath);

    for (const item of items) {
        const itemPath = path.join(localPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            const folderId = await createFolder(drive, item, parentId);
            await uploadFolderRecursive(drive, itemPath, folderId);
        } else {
            await uploadFile(drive, itemPath, item, parentId);
        }
    }
}

async function findFileInFolder(drive, folderId, name) {
    const res = await drive.files.list({
        q: `'${folderId}' in parents and name = '${name}' and trashed = false`,
        fields: 'files(id, name, mimeType)',
    });
    return res.data.files[0];
}

async function downloadFile(drive, fileId, destPath) {
    const dest = fs.createWriteStream(destPath);
    const res = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
    );
    
    return new Promise((resolve, reject) => {
        res.data
            .on('end', () => {})
            .on('error', reject)
            .pipe(dest);
        
        dest.on('finish', resolve);
        dest.on('error', reject);
    });
}

// Recursively restore a folder from Drive
async function restoreFolderRecursive(drive, folderId, localPath) {
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
    }

    const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
        pageSize: 1000 // Page size might need handling if > 1000 files/folder
    });

    for (const file of res.data.files) {
        const localFilePath = path.join(localPath, file.name);
        if (file.mimeType === 'application/vnd.google-apps.folder') {
            await restoreFolderRecursive(drive, file.id, localFilePath);
        } else {
            await downloadFile(drive, file.id, localFilePath);
        }
    }
}

// --- Controller Methods ---

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
        console.log('Starting backup process (Folder Structure)...');
        const tokens = loadToken();
        if (!tokens) return res.status(401).json({ message: 'Google Drive not connected' });

        const oAuth2Client = getOAuthClient();
        oAuth2Client.setCredentials(tokens);
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const backupTempDir = path.join(__dirname, '../backup_temp');
        if (!fs.existsSync(backupTempDir)) fs.mkdirSync(backupTempDir, { recursive: true });

        // 1. Export DB and Zip it (keeping DB as a single zip is cleaner/safer)
        console.log('Exporting database...');
        const dbDumpPath = path.join(backupTempDir, 'db_dump');
        if (!fs.existsSync(dbDumpPath)) fs.mkdirSync(dbDumpPath, { recursive: true });

        const db = require('../models');
        const modelNames = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');
        
        for (const modelName of modelNames) {
            try {
                if(typeof db[modelName].findAll === 'function') {
                    const data = await db[modelName].findAll();
                    fs.writeFileSync(path.join(dbDumpPath, `${modelName}.json`), JSON.stringify(data, null, 2));
                }
            } catch (err) { console.error(`Failed model ${modelName}`, err.message); }
        }

        const dbZipPath = path.join(backupTempDir, 'database.zip');
        const output = fs.createWriteStream(dbZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);
        archive.directory(dbDumpPath, false); // Zip contents, not the folder itself
        await archive.finalize();
        await new Promise((resolve, reject) => { output.on('close', resolve); output.on('error', reject); });
        
        // 2. Create Main Backup Folder on Drive
        const folderName = `Backup_${new Date().toISOString().replace(/[:.]/g, '-')}`;
        console.log(`Creating drive folder: ${folderName}`);
        const mainFolderId = await createFolder(drive, folderName);

        // 3. Upload DB Zip
        console.log('Uploading database.zip...');
        await uploadFile(drive, dbZipPath, 'database.zip', mainFolderId, 'application/zip');

        // 4. Upload Uploads Folder recursively
        console.log('Uploading uploads folder recursively...');
        const localUploadsPath = path.join(__dirname, '../public/uploads'); // Note: previously public/uploads
        // Create 'uploads' folder on Drive
        const driveUploadsFolderId = await createFolder(drive, 'uploads', mainFolderId);
        
        if (fs.existsSync(localUploadsPath)) {
            await uploadFolderRecursive(drive, localUploadsPath, driveUploadsFolderId);
        }

        // Cleanup
        fs.unlinkSync(dbZipPath);
        fs.rmSync(dbDumpPath, { recursive: true, force: true });
        // Keeping backup_temp dir is fine, just empty

        console.log('Backup complete.');
        res.json({ success: true, message: 'Backup created successfully', fileId: mainFolderId });

    } catch (error) {
        console.error('Backup error:', error);
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

        // List Folders starting with Backup_
        const response = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and name contains 'Backup_' and trashed = false",
            fields: 'files(id, name, createdTime)',
            orderBy: 'createdTime desc'
        });

        // Add dummy size since folders don't have size 0, or calculate strictly (expensive)
        const backups = response.data.files.map(f => ({ ...f, size: 0 }));

        res.json({ success: true, files: backups });
    } catch (error) {
        console.error('List error:', error);
        res.status(500).json({ message: 'Failed to list backups' });
    }
};

exports.restoreBackup = async (req, res) => {
    const { fileId } = req.params; // This is now the Main Folder ID
    try {
        console.log(`Starting restore from Folder ID: ${fileId}`);
        const tokens = loadToken();
        if (!tokens) return res.status(401).json({ message: 'Not connected' });

        const oAuth2Client = getOAuthClient();
        oAuth2Client.setCredentials(tokens);
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const backupTempDir = path.join(__dirname, '../backup_temp');
        if (!fs.existsSync(backupTempDir)) fs.mkdirSync(backupTempDir, { recursive: true });

        // 1. Find and Restore Database
        const dbZipFile = await findFileInFolder(drive, fileId, 'database.zip');
        if (!dbZipFile) throw new Error('database.zip not found in backup folder');

        console.log('Downloading database.zip...');
        const dbZipPath = path.join(backupTempDir, 'restore_db.zip');
        await downloadFile(drive, dbZipFile.id, dbZipPath);

        console.log('Restoring Database...');
        // Extract DB Zip
        const zip = new AdmZip(dbZipPath);
        const dbDumpExtractPath = path.join(backupTempDir, 'restore_db_dump');
        zip.extractAllTo(dbDumpExtractPath, true);

        // Restore DB Data
        const db = require('../models');
        const files = fs.readdirSync(dbDumpExtractPath);
        
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            const modelName = file.replace('.json', '');
            if (db[modelName]) {
                const data = JSON.parse(fs.readFileSync(path.join(dbDumpExtractPath, file)));
                await db[modelName].destroy({ truncate: true, cascade: true });
                if (data.length > 0) {
                     await db[modelName].bulkCreate(data);
                }
            }
        }
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        // 2. Restore Uploads
        console.log('Restoring Uploads...');
        const uploadsFolder = await findFileInFolder(drive, fileId, 'uploads');
        if (uploadsFolder) {
            const localUploadsDir = path.join(__dirname, '../public/uploads');
            // Clear existing uploads? Yes, for clean restore.
            if (fs.existsSync(localUploadsDir)) {
                fs.rmSync(localUploadsDir, { recursive: true, force: true });
            }
            fs.mkdirSync(localUploadsDir, { recursive: true });

            await restoreFolderRecursive(drive, uploadsFolder.id, localUploadsDir);
        } else {
            console.warn('No uploads folder found in backup.');
        }

        // Cleanup
        fs.unlinkSync(dbZipPath);
        fs.rmSync(dbDumpExtractPath, { recursive: true, force: true });

        console.log('Restore complete.');
        res.json({ success: true, message: 'Restore completed successfully' });

    } catch (error) {
        console.error('Restore error:', error);
        res.status(500).json({ message: 'Restore failed', error: error.message });
    }
};
