import { Router } from "express";
import { authSignin, authSignup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", authSignup);

router.post("/signin", authSignin);

export default router;