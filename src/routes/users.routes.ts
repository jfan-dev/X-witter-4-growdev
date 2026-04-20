import { Router } from "express";
import { getUser } from "../controllers/users.controller.js";
import { follow, unfollow } from "../controllers/follow.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateUserIdParam } from "../middlewares/validation/user.validation.js";

const router = Router();

router.get("/:id", authMiddleware, validateUserIdParam, getUser);

router.post("/:id/follow", authMiddleware, validateUserIdParam, follow);

router.delete("/:id/follow", authMiddleware, validateUserIdParam, unfollow);

export default router