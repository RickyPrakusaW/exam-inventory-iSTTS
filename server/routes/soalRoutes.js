const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const soalController = require('../controllers/soalController');

router.post('/', upload.single('file'), soalController.createSoal);
router.get('/', soalController.getAllSoal);

module.exports = router;
