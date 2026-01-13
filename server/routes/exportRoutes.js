const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Export data
router.get('/', exportController.exportData);

// Get export stats
router.get('/stats', exportController.getExportStats);

module.exports = router;
