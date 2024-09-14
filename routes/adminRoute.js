// routes/adminRoute.js
const express = require('express');
const upload=require('../utils/multer')

const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware=require('../middlewares/authMiddleware')



router.post('/admin/login', adminController.AdminLogin);
router.get('/admin/users',authMiddleware,adminController.userList)
router.get('/admin/petlist',authMiddleware,adminController.petList)
router.post('/admin/adoptpet',authMiddleware,upload.single('image'),adminController.AdminAdoptPet)
module.exports = router;
