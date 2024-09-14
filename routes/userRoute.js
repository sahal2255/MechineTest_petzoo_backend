const express=require('express')
const router=express.Router()
const upload=require('../utils/multer')
const userController=require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')


router.post('/signup',userController.userSign)
router.post('/login',userController.userLogin)
router.get('/profile', authMiddleware, userController.profileGet);
router.post('/petsadoption',authMiddleware,upload.single('image'),userController.petsAdopt)
router.get('/adoptedpetget',authMiddleware,userController.adoptedPetGet)
router.get('/pets',authMiddleware,userController.fullPetList)
router.get('/petowner/:userId',authMiddleware,userController.petOwner)
module.exports=router