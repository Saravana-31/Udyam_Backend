"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.rateLimiter = exports.requestLogger = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
};
exports.errorHandler = errorHandler;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
const requestCounts = new Map();
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
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
exports.rateLimiter = rateLimiter;
exports.corsOptions = {
    origin: process.env['FRONTEND_URL']
        ? [process.env['FRONTEND_URL']]
        : ["http://localhost:3000", "https://localhost:3000", "https://udyam-frontend-rho.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
//# sourceMappingURL=index.js.map