const mongoose=require('mongoose')

const AdoptionSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    petId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pet',
        required:true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'], // Set possible statuses
        default: 'pending', // Default status is 'pending'
      },
      adoptedAt: {
        type: Date,
        default: Date.now,
      },
})

const Adoption=mongoose.model('Adoption',AdoptionSchema)
module.exports=Adoption