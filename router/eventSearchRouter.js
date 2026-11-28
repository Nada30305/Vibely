
const express = require('express');
const router = express.Router();

const {
    searchEvents
} = require('../controller/eventSearchController');

router.get('/search', searchEvents);

module.exports = router;
