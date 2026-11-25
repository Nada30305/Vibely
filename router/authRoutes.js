
const express = require('express');
const router = express.Router();

const { register, login } = require('../controller/authcontroller');
const verifyToken = require('../middelware/authMiddleware');
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Vibely API!'
    });
});

router.post('/register', register);

router.post('/login', login);

// Protected profile route
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to your profile!',
        user: req.user
    });
});

module.exports = router;


