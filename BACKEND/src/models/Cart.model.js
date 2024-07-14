import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    // user details
    orderedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    // product array
    orderItems:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        quantity:{
            type:Number,
            required: true,
        }
    }],
    address:{
        type: String,
        required: true,
    },
    orderTotal:{
        type: Number,
        required: true,
    }
},{timestamps: true})

export const Cart = mongoose.model("Cart",cartSchema)