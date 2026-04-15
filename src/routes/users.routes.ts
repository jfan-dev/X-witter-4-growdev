import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUser } from "../controllers/users.controller.js";
import { follow, unfollow } from "../controllers/follow.controller.js";

const router = Router();

router.get("/:id", authMiddleware, getUser);

router.post("/:id/follow", authMiddleware, follow);

router.delete("/:id/follow", authMiddleware, unfollow);

export default router