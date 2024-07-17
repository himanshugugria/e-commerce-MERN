import {asyncHandler}from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { stringify } from 'flatted'; 
import { Seller } from '../models/seller.model.js';


const generateAccessandRefreshToken = async(userId)=>{
    const user = await Seller.findById(userId);

    const accessToken = user.generateAccessToken();    // from user.model
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken};
}

const sellerRegister = asyncHandler(async(req,res)=>{
    // take input from req.body  // fullName,email,password
    // check if user already exist
    // create user object 
    // store it in DB

    const {fullName,email,password} = req.body

    if(!fullName || !email || !password){
        throw new ApiError(401,"enter all values")
    }

    // checking if user already exist
    const existeduser =await Seller.findOne({
        email
    })
    if(existeduser){
        throw new ApiError(401,"user already exist")
    }

    // creating user object in db
    const user = await Seller.create({
        fullName,
        email,
        password,
    })

    // check for created user
    const createduser = await Seller.findById(user._id).select("-password -refreshToken")
    if(!createduser){
        throw new ApiError(500,"something went wrong while creating the user")
    }

    // removing circular references (if any)
    const safeuser = JSON.parse(stringify(createduser))

    return res.status(200).json(
        new ApiResponse(200,safeuser,"user created successfully")
    )
})
const sellerlogin = asyncHandler(async(req,res)=>{
    const {email,password}= req.body

    // check if user exist
    const userexist = await Seller.findOne({email})
    if(!userexist){
        throw new ApiError(400,"user does not exist")
    }

    // check if password is correct
    const validpassword = await userexist.isPasswordCorrect(password)
    console.log(validpassword);
    if(!validpassword){
        throw new ApiError(400,"password is incorrect")
    }

    const {accessToken,refreshToken}= await generateAccessandRefreshToken(userexist._id);

    const loggedInUser = await Seller.findById(userexist._id).select("-password -refreshToken")
    const safeUser =await JSON.parse(stringify(loggedInUser))

    const options={
        httpOnly:true,       // that means frontend can't modify it
        secure:true,
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {user:safeUser,accessToken,refreshToken},  // frontend me hum isko response.data.data. se access karenge as hmne data me ApiResponse bheja hai and usme data me ye 3 cheeze bheji hai
            "user logged in successfully"
            )
    )

})
const sellerlogout =asyncHandler(async(req,res)=>{
 Seller.findByIdAndUpdate(
        req.body._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
    )
    const options={
        httpOnly: true,
        secure: true,
    }

    return res.
    status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"logged out successfully")
    )
})
export {sellerRegister,sellerlogin,sellerlogout}