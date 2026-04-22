import type { NextFunction, Request, Response } from "express";
import { likeXweet, unlikeXweet } from "../services/like.service.js";

export async function like(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const xweetId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!xweetId) {
      return res.status(400).json({ error: "Xweet id is required" });
    }

    const result = await likeXweet(req.userId, xweetId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function unlike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const xweetId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!xweetId) {
      return res.status(400).json({ error: "Xweet id is required" });
    }

    const result = await unlikeXweet(req.userId, xweetId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}