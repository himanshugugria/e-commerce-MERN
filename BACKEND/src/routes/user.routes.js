import { Router } from "express";
import { userRegister, userlogin, userlogout } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(userRegister)
router.route("/login").post(userlogin)
router.route("/logout").post(userlogout)

export default router