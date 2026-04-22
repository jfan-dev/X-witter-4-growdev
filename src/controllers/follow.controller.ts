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
    if (!req.params.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const result = await followUser(req.userId, req.params.id);
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
    const result = await unfollowUser(req.userId, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}