// for seller 
// it will be just as user schema but the owner of product will be the seller schema

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const sellerSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: [true,"a password is required"],
    },
    fullName:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: String,
    }
},{timestamps:true})

sellerSchema.pre("save",async function(next){     
    if(! this.isModified("password")){
        return next()
    }
    else{
        this.password = await bcrypt.hash(this.password,10)
        next();
    }
})

// checking for correct password
sellerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

// generating access and refersh tokens
sellerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
       { _id : this._id,
        email : this.email,}
    ,
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
sellerSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
       { _id : this._id,}
    ,
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}


export const Seller = mongoose.model("Seller",sellerSchema)