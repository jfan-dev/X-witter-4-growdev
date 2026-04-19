import { Router } from "express";
import { authSignin, authSignup } from "../controllers/auth.controller.js";
import { validateSignin, validateSignup } from "../middlewares/validation/auth.validation.js";

const router = Router();

router.post("/signup", validateSignup, authSignup);

router.post("/signin", validateSignin, authSignin);

export default router;