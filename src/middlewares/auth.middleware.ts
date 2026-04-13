import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token missing" });
    }

    const [, token] = authHeader.split(" ");

    const decoded = jwt.verify(token, "supersecret");

    req.userId = decoded.userId;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}