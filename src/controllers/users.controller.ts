import type { NextFunction, Request, Response } from "express";
import { getUserProfile, searchUsers } from "../services/users.service.js";

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const currentUserId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "User id is required" });
    }

    if (!currentUserId) {
      return res.status(401).json({ error: "Authenticated user is required" });
    }

    const user = await getUserProfile(userId, currentUserId);

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

export async function search(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = typeof req.query.query === "string" ? req.query.query : "";

    const users = await searchUsers(query);

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}