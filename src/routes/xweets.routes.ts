import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { create, reply } from "../controllers/xweet.controller.js";

const router = Router();


router.post("/", authMiddleware, create);

router.post("/:id/reply", authMiddleware, reply);

router.post("/:id/like", authMiddleware, (req, res) => {
    return res.json({ message: "xweets like route working"})
})

router.delete("/:id/like", authMiddleware, (req, res) => {
    return res.json({ message: "xweets delete like route working"})
})

export default router;