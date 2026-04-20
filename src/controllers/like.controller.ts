import type { NextFunction, Request, Response } from "express";
import { likeXweet, unlikeXweet } from "../services/like.service.js";

export async function like(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await likeXweet(req.userId, req.params.id);
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
    const result = await unlikeXweet(req.userId, req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}