import type { NextFunction, Request, Response } from "express";
import { followUser, unfollowUser } from "../services/follow.service.js";

export async function follow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const targetUserId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!targetUserId) {
      return res.status(400).json({ error: "User id is required" });
    }

    const result = await followUser(req.userId, targetUserId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function unfollow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const targetUserId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!targetUserId) {
      return res.status(400).json({ error: "User id is required" });
    }

    const result = await unfollowUser(req.userId, targetUserId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}