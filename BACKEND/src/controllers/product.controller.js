// here addProduct remove update and view product will be added 

import { Product } from "../models/product.model.js";

// product jo hoga vo seller ka hoga
import { Seller } from "../models/seller.model.js";

import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

import {uploadOnCloudinary} from '../utils/Cloudinary.js'

const addProduct =asyncHandler(async(req,res)=>{
    const {name,description,price,quantity}=req.body
    const userId = req.user._id           //ye req.user auth middleware me hai

    if (!req.file) {                                  // ye req.file jo hai vo route me hi set ki hai
        throw new ApiError(400, "Product image is required");
    }
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const cloudinaryResponse = await uploadOnCloudinary(fileBuffer, fileName);

    if (!cloudinaryResponse) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
    }

    const productImage = cloudinaryResponse.secure_url;

    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        // category,
        productImage,
        userId: userId,    // userId(product ka owner(seller)) : userId (upar wali)
    })

    const seller = await Seller.findById(userId);
    if(!seller){
        throw new ApiError(400,"seller not found")
    }
    const savedProduct = await product.save();
    seller.products.push(savedProduct)      // products array me push kardo
    await seller.save();

    return res.status(200).json(
        new ApiResponse(200,savedProduct,"product added successfully")
    )
})

export {addProduct}