const express = require('express');
const router = express.Router();

const { register } = require('../controller/authcontroller');

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Vibely API!'
    });
});

router.post('/register', register);

module.exports = router;