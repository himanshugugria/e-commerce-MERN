import { Router } from "express";
import {sellerRegister,sellerlogin,sellerlogout} from '../controllers/seller.controller.js'

const router = Router();

router.route("/register").post(sellerRegister)
router.route("/login").post(sellerlogin)
router.route("/logout").post(sellerlogout)

export default router