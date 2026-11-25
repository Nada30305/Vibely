
const express = require('express');
const router = express.Router();

const { getAdminStats } = require('../controller/authcontroller');

// Temporary local testing route.
// Add your existing backend admin-auth middleware before deployment.
router.get('/stats', getAdminStats);

module.exports = router;
