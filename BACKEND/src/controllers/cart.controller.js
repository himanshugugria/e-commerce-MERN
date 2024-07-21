/*
toh jaise maine har seller ko add product karne ki ek option di thi vaise hi
lets create ki user(buyer) bhi add kar payega products to its cart

steps
1. add a cart array to every user taaki vo jab bhi login ho toh usko apna cart dikhe
2. product ki id lo aur usko us cart wale array me daal do
3. just like ki har product ka ek owner hai and ek seller(owner) hai uske paas ek product array hai
*/



import {Cart} from '../models/Cart.model.js'

import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js';

const addtoCart = asyncHandler(async(req,res)=>{
    
    const {productId,quantity,address} = req.body
    const userId = req.user._id;                    // auth middleware se (for buyer)
    
    let cart= await Cart.create({           
        userId : userId,
        address,
        orderItems:[productId,quantity],
    })

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(400,"user not found!")
    }
    const savedcart = await cart.save();
    user.cart = savedcart._id;         // user ki cart k ander is cart ki id daaldo

})