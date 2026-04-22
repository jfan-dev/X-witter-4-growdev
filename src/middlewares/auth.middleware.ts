import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token missing" });
    }

    const [, token] = authHeader.split(" ");

    const decoded = jwt.verify(token, env.jwtSecret);

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}