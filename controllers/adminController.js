const Admin=require('../models/adminModel')
const jwt=require('jsonwebtoken');
const User = require('../models/userModel');
const cloudinary=require('../utils/cloudinaryConfig')

const Pets = require('../models/pet');

const AdminLogin = async (req, res) => {
    console.log('Finding login route');
    const {email,password}=req.body
    console.log('email',email)
    console.log('password',password)
    try {
        const admin = await Admin.findOne({ email });
        console.log('admin:', admin);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        if (password !== admin.password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        

        const token = jwt.sign(
            { userId: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        console.log('Generated token:', token);

        res.cookie('token', token, { 
            maxAge: 3600000  // 1 hour in milliseconds
        });

        return res.status(200).json({ message: 'Admin logged in successfully', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Login error' });
    }
}
const adminLogout = (req, res) => {
    res.clearCookie('token'); 
    return res.status(200).json({ message: 'Logout successful' });
};


const userList=async(req,res)=>{
    try{
        const users=await User.find()
        console.log('userlisting',users);
        return res.status(200).json(users)
    }catch(error){
        console.log('error during userlisting',error)
    }
}

const petList=async(req,res)=>{
    try{
        const pets=await Pets.find()
        // console.log('fetched pets',pets);
        res.status(200).json(pets)
    }catch(error){
        console.log('fetching petlist error',error);
        
    }
}

const AdminAdoptPet=async(req,res)=>{
    try {
        console.log('Received data:', req.body);  
        console.log('Received file:', req.file);  
        console.log('userId',req.user.userId);
        const userId=req.user.userId
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'pets_adoption', 
            use_filename: true,
            unique_filename: false
        });
        console.log('result',result);
        
        const newPet = new Pets({
            name: req.body.name,
            age: req.body.age,
            breed: req.body.breed,
            image: result.secure_url,  
            userId: userId
        });
        console.log('new pte',newPet);
        
        await newPet.save();

        res.status(201).json({
            success: true,
            message: 'Pet successfully added for adoption',
            pet: newPet
        });
    } catch (error) {
        console.error('Error in petsAdopt:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, unable to add pet for adoption',
        });
    }
}
module.exports={
    AdminLogin,
    adminLogout,
    userList,
    petList,
    AdminAdoptPet
}