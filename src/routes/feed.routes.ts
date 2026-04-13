import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware,(req, res) => {
    return res.json({ message: "feed route working"})
})

export default router;