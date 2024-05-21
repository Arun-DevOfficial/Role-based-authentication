import express from "express";
import { signIn, signUp, getUser } from "../Controller/User.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import cors from "cors";

//router config
const router = express.Router();
router.use(express.json()); // body parser

router.use(cors());
//Router path config
router.route("/signUp").post(signUp);
router.route("/signIn").post(verifyAdmin, signIn);
router.route("/view").get(verifyAdmin, getUser);

export default router;
