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

const updateProduct = asyncHandler(async(req,res)=>{
    const id =req.params.id;
    const userId = req.user._id;
    
    // now things which seller can update
    const {name,price,description,productImage,quantity} = req.body

    const product = await Product.findOne({_id: id,userId : userId})
    if(!product){
        throw new ApiError(400,"product not found!")
    }

    if(name) product.name = name
    if(price) product.price = price
    if(description) product.description = description
    if(quantity) product.quantity = quantity
    if(productImage) product.productImage = productImage

    await product.save();
    return res.status(200).json(new ApiResponse(200,product,"product updated successfully"))
})

const removeProduct = asyncHandler(async(req,res)=>{
    const id = req.params.id;         // url se jo id aayegi product ki usko product ki id se match karna
    const userId = req.user._id;

    const product = await Product.findOne({_id: id,userId : userId})
    if(!product){
        throw new ApiError(400,"product not found!")
    }

    await Product.deleteOne({_id: id,userId : userId})
    return res.status(200).json("product removed successfully")
})

const getallProduct = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const allProducts = await Product.find({userId : userId})
    return res.status(200).json(
        new ApiResponse(200,allProducts,"all products fetched")
    )
})

export {addProduct,updateProduct,removeProduct,getallProduct}