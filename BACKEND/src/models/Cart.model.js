import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    // user details
    // orderedBy:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"User"
    // },
    // so instead of doing this we can take the userId from header

    userId:{      // ye req.user.id se le lenge
        type: String,
        required: true,
    },

    // product array
    orderItems:[{              // ye req.body se lenge
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        quantity:{
            type:Number,
            required: true,
        }
    }],
    address:{      // req.body se lenge
        type: String,
        required: true,
    },
    orderTotal:{       // req.body se lenge
        type: Number,
        // required: true,
    }
},{timestamps: true})

export const Cart = mongoose.model("Cart",cartSchema)