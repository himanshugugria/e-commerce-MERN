import { Router } from "express";
import { verifyJWT2 } from "../middlewares/auth_2.middleware.js";
import { addtoCart } from "../controllers/cart.controller.js";

const router=Router();

router.route("/addtoCart").post(verifyJWT2,addtoCart)

export default router