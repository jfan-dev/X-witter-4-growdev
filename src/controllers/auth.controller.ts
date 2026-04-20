import type { NextFunction, Request, Response } from "express";
import { signin, signup } from "../services/auth.service.js";

export async function authSignup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await signup(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function authSignin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await signin(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}