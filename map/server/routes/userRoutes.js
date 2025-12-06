const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/location', authMiddleware, userController.updateLocation);
router.get('/all', authMiddleware, userController.getAllUsers);
router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;