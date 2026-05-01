import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { feed } from "../controllers/feed.controller.js";

const router = Router();

router.get("/", authMiddleware, feed);

export default router;