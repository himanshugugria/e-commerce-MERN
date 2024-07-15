import {asyncHandler}from '../utils/AsyncHandler'
import { User } from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const userRegister = asyncHandler(async(req,res)=>{
    // take input from req.body  // fullName,email,password
    // check if user already exist
    // create user object 
    // store it in DB

    const {fullName,email,password} = req.body

    if(!fullName || !email || !password){
        throw new ApiError(401,"enter all values")
    }

    // checking if user already exist
    const existeduser =await User.findOne({
        email
    })
    if(existeduser){
        throw new ApiError(401,"user already exist")
    }

    // creating user object in db
    const user = await User.create({
        fullName,
        email,
        password,
    })

    // check for created user
    const createduser = await User.findById(user._id).select("-password -refreshToken")
    if(!createduser){
        throw new ApiError(500,"something went wrong while creating the user")
    }

    // removing circular references (if any)
    const safeuser = JSON.parse(stringify(createduser))

    return res.status(200).json(
        new ApiResponse(200,safeuser,"user created successfully")
    )
})
const userlogin = asyncHandler(async(req,res)=>{
    const {email,password}= req.body

    // check if user exist
    const userexist = await User.findOne(email)
    if(!userexist){
        throw new ApiError(400,"user does not exist")
    }

    // check if password is correct
    const validpassword = await userexist.isPasswordCorrect(password)
    if(!validpassword){
        throw new ApiError(400,"password is incorrect")
    }


})
export {userRegister,userlogin}