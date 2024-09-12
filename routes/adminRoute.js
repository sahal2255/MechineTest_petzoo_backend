// routes/adminRoute.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/admin/login', adminController.AdminLogin);

module.exports = router;
