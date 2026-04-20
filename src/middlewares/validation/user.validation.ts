import { validate as isValidUUID } from 'uuid';
import type { Request, Response, NextFunction } from "express";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateUserIdParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!isNonEmptyString(id)) {
    return res.status(400).json({ error: "User id is required" });
  }

  if (!isValidUUID(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  return next();
}
