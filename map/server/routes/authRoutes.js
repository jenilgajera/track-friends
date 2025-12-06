const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/google-login', authController.googleLogin);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;