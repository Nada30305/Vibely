
const express = require('express');
const router = express.Router();

// Import register controller
const { register } = require('../controller/authcontroller');

// Welcome route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Vibely API!'
    });
});

// Register route
router.post('/register', register);

module.exports = router;
