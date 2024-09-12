const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    age: {
        type: Number,
        required: true,  
    },
    breed: {
        type: String,
        required: true, 
    },
    image: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Referencing the User who adopts
        ref: 'User',  // Assuming you have a User model
        required: true,
    }
});

const Pets = mongoose.model('Pets', petSchema);
module.exports = Pets;
