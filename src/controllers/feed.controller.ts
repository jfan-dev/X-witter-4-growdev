import type { NextFunction, Request, Response } from "express";
import { getFeed } from "../services/feed.service.js";

export async function feed(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tweets = await getFeed(req.userId);
    return res.status(200).json(tweets);
  } catch (error) {
    return next(error);
  }
}