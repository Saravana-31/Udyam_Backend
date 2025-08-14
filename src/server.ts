// Main Express server setup
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import dotenv from "dotenv"

import submissionRoutes from "./routes/submission"
import { errorHandler, requestLogger, corsOptions } from "./middleware"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env['PORT'] || 5000

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)

// CORS configuration
app.use(cors(corsOptions))

// Compression middleware
app.use(compression())

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Logging middleware
if (process.env['NODE_ENV'] === "production") {
  app.use(morgan("combined"))
} else {
  app.use(morgan("dev"))
  app.use(requestLogger)
}

// API routes
app.use("/api", submissionRoutes)

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Udyam Registration Backend API",
    data: {
      version: "1.0.0",
      endpoints: [
        "POST /api/submit - Submit registration form",
        "GET /api/submissions - Get all submissions",
        "GET /api/stats - Get submission statistics",
        "GET /api/health - Health check",
      ],
    },
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env['NODE_ENV'] || "development"}`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("Process terminated")
  })
})

export default app
