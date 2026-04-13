import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id", authMiddleware, (req, res) => {
    return res.json({ message: "users route working"})
})

router.post("/:id/follow", authMiddleware, (req, res) => {
    return res.json({ message: "users follow route working"})
})

router.delete("/:id/follow", authMiddleware, (req, res) => {
    return res.json({ message: "users unfollow route working"})
})

export default router