import type { NextFunction, Request, Response } from "express";
import { createXweet, replyToXweet } from "../services/xweet.service.js";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const content = req.body?.content;

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const xweet = await createXweet(req.userId, content);
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
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const xweetId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!xweetId) {
      return res.status(400).json({ error: "Xweet id is required" });
    }

    const content = req.body?.content;

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const xweet = await replyToXweet(req.userId, xweetId, content);
    return res.status(201).json(xweet);
  } catch (error) {
    return next(error);
  }
}