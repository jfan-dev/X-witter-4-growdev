import type { NextFunction, Request, Response } from "express";
import { getUserProfile } from "../services/users.service.js";

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await getUserProfile(req.params.id);

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}