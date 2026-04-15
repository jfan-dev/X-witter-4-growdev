import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { create, reply } from "../controllers/xweet.controller.js";
import { like, unlike } from "../controllers/like.controller.js";

const router = Router();


router.post("/", authMiddleware, create);

router.post("/:id/reply", authMiddleware, reply);

router.post("/:id/like", authMiddleware, like);

router.delete("/:id/like", authMiddleware, unlike);

export default router;