const express = require('express');
const router = express.Router();
const masterDataController = require('../controllers/masterDataController');


router.get('/prodi', masterDataController.getAllProdi);
router.post('/prodi', masterDataController.createProdi);
router.put('/prodi/:id', masterDataController.updateProdi);
router.delete('/prodi/:id', masterDataController.deleteProdi);

router.get('/matkul', masterDataController.getAllMatkul);
router.post('/matkul', masterDataController.createMatkul);
router.put('/matkul/:id', masterDataController.updateMatkul);
router.delete('/matkul/:id', masterDataController.deleteMatkul);

module.exports = router;
