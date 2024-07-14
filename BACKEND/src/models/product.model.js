import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    price:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    productImage:{
        type: String,   // cloudinary url
        required: true,
    }
},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)