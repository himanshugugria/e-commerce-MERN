import  express  from "express";
const app= express();

// import cors from 'cors'
import cookieParser from 'cookie-parser'

// const corsOptions = {
//     origin: 'http://localhost:5173', // Ensure there is no trailing slash
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: 'Authorization, X-Requested-With, Content-Type, Accept'
// };

// app.use(cors(corsOptions));

// app.options('*', cors(corsOptions));

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