const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
// const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware'); // Uncomment if auth is needed

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, isAdmin, dashboardController.getDashboardStats);

module.exports = router;
