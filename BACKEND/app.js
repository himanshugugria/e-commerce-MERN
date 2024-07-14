import  express  from "express";
const app= express();

import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))

export default app;