const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

router.get('/:userId', libraryController.getLibrary);
router.post('/', libraryController.addToLibrary);
router.delete('/:userId/:soalId', libraryController.removeFromLibrary);

module.exports = router;
