const express = require('express');
const { loginSeller, registerSeller, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginSeller);
router.post('/register', registerSeller);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
