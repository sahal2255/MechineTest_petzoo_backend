require('dotenv').config(); // Ensure this line is at the top of your file

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_API_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// console.log('Cloudinary configuration:', {
//     cloud_name: process.env.CLOUD_API_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// });

module.exports = cloudinary;
