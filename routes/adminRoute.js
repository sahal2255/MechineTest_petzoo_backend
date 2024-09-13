// routes/adminRoute.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware=require('../middlewares/authMiddleware')
router.post('/admin/login', adminController.AdminLogin);
router.get('/admin/users',authMiddleware,adminController.userList)
router.get('/admin/petlist',authMiddleware,adminController.petList)

module.exports = router;
