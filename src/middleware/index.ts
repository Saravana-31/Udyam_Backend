// Express middleware functions
import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types";

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

// Rate limiting simulation (in production, use redis-based rate limiting)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (
  maxRequests = 100,
  windowMs: number = 15 * 60 * 1000
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || "unknown";
    const now = Date.now();

    const clientData = requestCounts.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        timestamp: new Date().toISOString(),
      });
    }

    clientData.count++;
    next();
  };
};

// ✅ CORS configuration (type-safe with fallback)
const frontendURL = process.env['FRONTEND_URL'] || "http://localhost:3000";

export const corsOptions = {
  origin: [frontendURL, "https://localhost:3000", "https://udyam-frontend-rho.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
