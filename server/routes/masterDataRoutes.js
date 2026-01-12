const express = require('express');
const router = express.Router();
const masterDataController = require('../controllers/masterDataController');

router.get('/prodi', masterDataController.getAllProdi);
router.get('/matkul', masterDataController.getAllMatkul);

module.exports = router;
