import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, (req, res) => {
    return res.json({ message: "xweets route working"})
})

router.post("/:id/reply", authMiddleware, (req, res) => {
    return res.json({ message: "xweets reply route working"})
})

router.post("/:id/like", authMiddleware, (req, res) => {
    return res.json({ message: "xweets like route working"})
})

router.delete("/:id/like", authMiddleware, (req, res) => {
    return res.json({ message: "xweets delete like route working"})
})

export default router;