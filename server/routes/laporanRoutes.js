const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

// Create a new report
router.post('/report', laporanController.createReport);

// Get all reports (Admin)
router.get('/', laporanController.getAllReports);

// Update report status (Admin)
router.put('/:id', laporanController.updateReportStatus);

module.exports = router;
