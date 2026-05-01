import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { create, reply } from "../controllers/xweet.controller.js";
import { like, unlike } from "../controllers/like.controller.js";
import {
  validateCreateXweet,
  validateReplyXweet,
  validateXweetIdParam,
} from "../middlewares/validation/xweet.validation.js";

const router = Router();

router.post("/", authMiddleware, validateCreateXweet, create);

router.post("/:id/reply", authMiddleware, validateXweetIdParam, validateReplyXweet, reply);

router.post("/:id/like", authMiddleware, validateXweetIdParam, like);

router.delete("/:id/like", authMiddleware, validateXweetIdParam, unlike);

export default router;