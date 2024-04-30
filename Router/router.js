import express from "express";
import { signIn, signUp } from "../Controller/User.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

//router config
const router = express.Router();
router.use(express.json()); // body parser

//Router path config
router.route("/signUp").post(signUp);
router.route("/signIn").post(verifyAdmin, signIn);

export default router;
