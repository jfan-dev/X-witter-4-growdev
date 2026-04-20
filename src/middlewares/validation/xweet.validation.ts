import type { Request, Response, NextFunction } from "express";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasValidXweetLength(value: string): boolean {
  return value.trim().length <= 280;
}

export function validateXweetIdParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!isNonEmptyString(id)) {
    return res.status(400).json({ error: "Xweet id is required" });
  }

  return next();
}

export function validateCreateXweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { content } = req.body;

  if (!isNonEmptyString(content)) {
    return res.status(400).json({ error: "Xweet content is required" });
  }

  if (!hasValidXweetLength(content)) {
    return res
      .status(400)
      .json({ error: "Content exceeds the 280 character limit" });
  }

  return next();
}

export function validateReplyXweet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { content } = req.body;

  if (!isNonEmptyString(content)) {
    return res.status(400).json({ error: "Xweet content is required" });
  }

  if (!hasValidXweetLength(content)) {
    return res
      .status(400)
      .json({ error: "Content exceeds the 280 character limit" });
  }

  return next();
}