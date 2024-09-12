const User=require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcrypt')
const cloudinary=require('../utils/cloudinaryConfig')
const Pets=require('../models/pet')
const userSign=async(req,res)=>{
    const {userName,email,password,phoneNumber}=req.body
    console.log('userName',userName);
    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            email,
            password:hashedPassword,
            phoneNumber
        });

        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email }, // Include userId in the token payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
        res.cookie('token',token,{
            maxAge:3600000
        })
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
}


const userLogin=async(req,res)=>{
    console.log('hitting the login route');
    const {email,password}=req.body

    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"invalid email or password"})
        }
        const validPassword=await bcrypt.compare(password,user.password)
        if(!validPassword){
            return res.status(400).json({message:'invalid password'})
        }
        const token = jwt.sign(
            { userId: user._id }, // Include userId in the token payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
            res.cookie('token',token,{
            maxAge:3600000
        })
        return res.status(200).json({message:'user login successfully'})
    }catch(error){
        console.log('user login error',error);
        res.status(500).json({ message: 'Server error during login' });        
    }
}
const profileGet = async (req, res) => {
    console.log('profile route hitting');
    
    try {
      const user = await User.findById(req.user.userId).select('-password'); // Exclude the password
        console.log(('user',user));
        
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber, // Include more fields as necessary
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error while fetching profile' });
    }
  };


const petsAdopt=async(req,res)=>{
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


const adoptedPetGet = async (req, res) => {
    console.log('pet get');
    const userId = req.user.userId; // Extract userId from req.user

    try {
        // Find pets that belong to the specified user
        const pets = await Pets.find({ userId: userId });

        // Check if any pets were found
        if (pets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No pets found for this user'
            });
        }

        // Respond with the list of pets
        res.status(200).json({
            success: true,
            pets: pets
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pets'
        });
    }
};



module.exports={
    userSign,
    userLogin,
    profileGet,
    petsAdopt,
    adoptedPetGet
}