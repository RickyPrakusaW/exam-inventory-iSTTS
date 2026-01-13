const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const soalController = require('../controllers/soalController');

router.post('/', upload.single('file'), soalController.createSoal);
router.get('/', soalController.getAllSoal);
router.put('/:id', upload.single('file'), soalController.updateSoal);
router.delete('/:id', soalController.deleteSoal);
// [NEW] Download history routes
router.get('/history/me', soalController.getDownloadHistory);
router.post('/:id/download', soalController.downloadSoal);
router.post('/email', soalController.emailSoals);

module.exports = router;
