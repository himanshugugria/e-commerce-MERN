import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
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


userSchema.pre("save",async function(next){     
    if(! this.isModified("password")){
        return next()
    }
    else{
        this.password = await bcrypt.hash(this.password,10)
        next();
    }
})

// checking for correct password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

// generating access and refersh tokens
userSchema.methods.generateAccessToken = function(){
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
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
       { _id : this._id,}
    ,
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}


export const User = mongoose.model("User",userSchema)