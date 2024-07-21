// auth middleware for buyer
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'

export const verifyJWT2 = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        console.log("token",token);

        if(!token){
            throw new ApiError(400,"token not found")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log("decodedToken",decodedToken);
        const user = await User.findById(decodedToken._id).select("-refreshToken -password")
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