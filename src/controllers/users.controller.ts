import type { NextFunction, Request, Response } from "express";
import { getUserProfile } from "../services/users.service.js";

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User id is required" });
    }

    const user = await getUserProfile(userId);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}