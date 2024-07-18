import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    // category:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"Category",
    // },
    quantity:{
        type:Number,
        required:true,
    },
    userId :{       // owner of the product
        type:String,
        required: true,
    },
    productImage:{
        type: String,   // cloudinary url
        required: true,
    }
},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)