import app from "./app.js";
import connectDB from "./src/db/connectDB.js";

import dotenv from "dotenv"              // as ye documentation me abhi tak mention nhi hui hai to we can run this using experimental feature in package.json
dotenv.config({path:'./env'})


const port = process.env.PORT || 5050
connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log("app is listening on PORT",port)
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed",error)
})