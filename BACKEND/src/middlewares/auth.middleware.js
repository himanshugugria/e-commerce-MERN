import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Seller } from '../models/seller.model.js'

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        console.log("token",token);

        if(!token){
            throw new ApiError(400,"token not found")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log("decodedToken",decodedToken);
        const user = await Seller.findById(decodedToken._id).select("-refreshToken -password")
        console.log("user",user);
        if(!user){
            throw new ApiError(500,"Invalid Access Token")
        }
        req.user = user
        next();
    } catch (error) {
        throw new ApiError(500,error?.message || "verifyJWT failed")
    }
})