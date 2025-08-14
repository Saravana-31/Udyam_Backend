// Routes for form submission endpoints
import { Router, type Request, type Response } from "express"
import { validateFormData } from "../config/validation"
import { SubmissionService } from "../services/submissionService"
import type { ApiResponse, FormData } from "../types"
import { rateLimiter } from "../middleware"

const router = Router()

// POST /api/submit - Submit registration form
router.post(
  "/submit",
  rateLimiter(10, 15 * 60 * 1000),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      console.log("📩 Received submission data:", req.body)

      const { isValid, errors, data } = validateFormData(req.body)

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
          timestamp: new Date().toISOString(),
        })
      }

      const submission = await SubmissionService.processSubmission(data as FormData)

      console.log("✅ Processed submission:", submission)

      // Fetch all submissions after adding the new one
      const submissions = await SubmissionService.getAllSubmissions()

      // Sanitize before sending to frontend
      const sanitizedSubmissions = submissions.map((sub) => ({
        id: sub.id,
        registrationNumber: sub.registrationNumber,
        name: sub.name,
        email: sub.email,
        orgType: sub.orgType,
        status: sub.status,
        submittedAt: sub.submittedAt,
      }))

      res.status(201).json({
        success: true,
        message: "Registration submitted successfully",
        data: {
          registrationNumber: submission.registrationNumber,
          submissionId: submission.id,
          submittedAt: submission.submittedAt,
          status: submission.status,
          allSubmissions: sanitizedSubmissions, // ✅ include all submissions
        },
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Submission error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error during submission",
        timestamp: new Date().toISOString(),
      })
    }
  }
)

// GET /api/submissions - Get all submissions (for admin/testing)
router.get("/submissions", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const submissions = await SubmissionService.getAllSubmissions()

    const sanitizedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      registrationNumber: sub.registrationNumber,
      name: sub.name,
      email: sub.email,
      orgType: sub.orgType,
      status: sub.status,
      submittedAt: sub.submittedAt,
    }))

    res.json({
      success: true,
      message: "Submissions retrieved successfully",
      data: {
        total: submissions.length,
        submissions: sanitizedSubmissions,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Get submissions error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    })
  }
})

// GET /api/stats - Get submission statistics
router.get("/stats", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const stats = await SubmissionService.getSubmissionStats()

    res.json({
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    })
  }
})

// GET /api/health - Health check endpoint
router.get("/health", (req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    message: "Server is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
    },
    timestamp: new Date().toISOString(),
  })
})

export default router
