import { replyToXweet, createXweet } from "../services/xweet.service.js";
import type { NextFunction, Request, Response } from "express";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const xweet = await createXweet(req.userId, req.body.content);
    return res.status(201).json(xweet);
  } catch (error) {
    return next(error);
  }
}

export async function reply(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const xweet = await replyToXweet(
      req.userId,
      req.params.id,
      req.body.content
    );
    return res.status(201).json(xweet);
  } catch (error) {
    return next(error);
  }
}