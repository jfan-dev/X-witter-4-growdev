import type { Request, Response, NextFunction } from "express";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidDateString(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isAtLeast13YearsOld(value: string): boolean {
  const birthdate = new Date(value);

  if (Number.isNaN(birthdate.getTime())) {
    return false;
  }

  const today = new Date();
  
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );

  return birthdate <= thirteenYearsAgo;
}

function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
}

export function validateSignup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password, birthdate } = req.body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (!isNonEmptyString(email)) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Email format is invalid" });
  }

  if (!isNonEmptyString(password)) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: "Password must have at least 8 characters, one uppercase letter, one number, and one symbol." });
  }

  if (!isNonEmptyString(birthdate)) {
    return res.status(400).json({ error: "Birthdate is required" });
  }

  if (!isValidDateString(birthdate)) {
    return res.status(400).json({ error: "Birthdate must be a valid date" });
  }

  if (!isAtLeast13YearsOld(birthdate)) {
    return res.status(400).json({ error: "User must be at least 13 years old" });
  }

  return next();
}

export function validateSignin(
  req: Request,
  res: Response,
  next: NextFunction 
) {
  const { email, password } = req.body;

  if (!isNonEmptyString(email)) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Email format is invalid" });
  }

  if (!isNonEmptyString(password)) {
    return res.status(400).json({ error: "Password is required" });
  }

  return next();
}