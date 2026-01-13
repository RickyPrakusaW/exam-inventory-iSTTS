const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

// Auth routes
router.get('/auth/url', backupController.getAuthUrl);
router.post('/auth/callback', backupController.oauthCallback);
router.get('/status', backupController.isConnected);

// Backup/Restore routes
router.post('/create', backupController.performBackup);
router.get('/list', backupController.listBackups);
router.post('/restore/:fileId', backupController.restoreBackup);

module.exports = router;
