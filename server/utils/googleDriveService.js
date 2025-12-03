const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

const uploadFileToDrive = async (fileObject) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileObject.originalname,
                mimeType: fileObject.mimetype,
            },
            media: {
                mimeType: fileObject.mimetype,
                body: fs.createReadStream(fileObject.path),
            },
        });

        // Set permission to public (optional, depending on requirements)
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get webViewLink and webContentLink
        const result = await drive.files.get({
            fileId: response.data.id,
            fields: 'webViewLink, webContentLink',
        });

        return {
            id: response.data.id,
            ...result.data,
        };
    } catch (error) {
        console.error('Error uploading to Drive:', error);
        throw error;
    }
};

module.exports = { uploadFileToDrive };
