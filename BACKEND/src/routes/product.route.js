// here we will add routes to add delete and update products

import { addProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/Cloudinary.js";

import { Router } from "express";

const router= Router();

router.route("/addProduct").post(upload.single('file'),verifyJWT,addProduct)


export default router