const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const soalController = require('../controllers/soalController');

router.post('/', upload.single('file'), soalController.createSoal);
router.get('/', soalController.getAllSoal);
router.get('/popular', soalController.getPopularSoals); // Specific routes first
router.get('/recent', soalController.getRecentSoals);   // Specific routes first
router.put('/:id', upload.single('file'), soalController.updateSoal);
router.delete('/:id', soalController.deleteSoal);
// [NEW] Download history routes
router.get('/history/me', soalController.getDownloadHistory);
router.post('/:id/download', soalController.downloadSoal);
router.post('/:id/like', soalController.toggleLikeSoal);
router.post('/email', soalController.emailSoals);

module.exports = router;
