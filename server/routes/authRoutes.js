const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/cadastrar', authController.cadastrar)
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
