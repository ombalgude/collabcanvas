import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";  

export function middleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(403).json({ message: "Token missing. Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    (req as any).userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
