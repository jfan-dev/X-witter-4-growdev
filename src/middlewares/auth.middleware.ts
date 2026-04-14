import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authMiddleware(req, res, next) {
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