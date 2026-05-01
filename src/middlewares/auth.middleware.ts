import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../prisma/client.js";

type AuthTokenPayload = JwtPayload & {
  userId: string;
  sessionId: string;
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string" ||
      !("sessionId" in decoded) ||
      typeof decoded.sessionId !== "string"
    ) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const payload = decoded as AuthTokenPayload;

    const session = await prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            isBanned: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(401).json({ error: "Session invalid or expired" });
    }

    if (session.user.isBanned) {
      return res.status(403).json({ error: "User is banned" });
    }

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}