const Admin=require('../models/adminModel')
const jwt=require('jsonwebtoken')

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

module.exports={
    AdminLogin,
    adminLogout
}