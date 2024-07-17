import  express  from "express";
const app= express();

import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))

import userRouter from './src/routes/user.routes.js'  // as hmne router ko default export kiya hai toh yahan kuch bhi naam se import kar sakte hai
import productRouter from './src/routes/product.route.js'
import sellerRouter from './src/routes/seller.routes.js'
app.use("/api/v1/users",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/seller",sellerRouter)
export default app;