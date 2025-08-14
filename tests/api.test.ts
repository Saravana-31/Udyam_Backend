// Integration tests for API endpoints
import request from "supertest"
import app from "../src/server"
import { validFormData, invalidFormData, partialFormData } from "./utils/testData"

describe("API Integration Tests", () => {
  describe("POST /api/submit", () => {
    test("should successfully submit valid form data", async () => {
      const response = await request(app).post("/api/submit").send(validFormData).expect(201)

      expect(response.body).toMatchObject({
        success: true,
        message: "Registration submitted successfully",
        data: {
          registrationNumber: expect.stringMatching(/^UDYAM-\d{8}-[A-Z0-9]{4}$/),
          submissionId: expect.any(String),
          submittedAt: expect.any(String),
          status: "pending",
        },
        timestamp: expect.any(String),
      })
    })

    test("should reject invalid form data with validation errors", async () => {
      const response = await request(app).post("/api/submit").send(invalidFormData).expect(400)

      expect(response.body).toMatchObject({
        success: false,
        message: "Validation failed",
        errors: expect.any(Object),
        timestamp: expect.any(String),
      })

      // Check that multiple validation errors are returned
      expect(Object.keys(response.body.errors)).toHaveLength(9)
    })

    test("should reject incomplete form data", async () => {
      const response = await request(app).post("/api/submit").send(partialFormData).expect(400)

      expect(response.body).toMatchObject({
        success: false,
        message: "Validation failed",
        errors: expect.any(Object),
      })

      expect(response.body.errors).toHaveProperty("email")
      expect(response.body.errors).toHaveProperty("otp")
      expect(response.body.errors).toHaveProperty("pan")
    })

    test("should handle empty request body", async () => {
      const response = await request(app).post("/api/submit").send({}).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Validation failed")
    })

    test("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/submit")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    test("should enforce rate limiting", async () => {
      // Make multiple requests quickly to trigger rate limiting
      const requests = Array(12)
        .fill(null)
        .map(() => request(app).post("/api/submit").send(validFormData))

      const responses = await Promise.all(requests)

      // Some requests should be rate limited (429 status)
      const rateLimitedResponses = responses.filter((res) => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    }, 15000)
  })

  describe("GET /api/submissions", () => {
    test("should return list of submissions", async () => {
      // First, submit some data
      await request(app).post("/api/submit").send(validFormData)

      const response = await request(app).get("/api/submissions").expect(200)

      expect(response.body).toMatchObject({
        success: true,
        message: "Submissions retrieved successfully",
        data: {
          total: expect.any(Number),
          submissions: expect.any(Array),
        },
      })

      if (response.body.data.submissions.length > 0) {
        const submission = response.body.data.submissions[0]
        expect(submission).toHaveProperty("id")
        expect(submission).toHaveProperty("registrationNumber")
        expect(submission).toHaveProperty("name")
        expect(submission).toHaveProperty("email")
        expect(submission).not.toHaveProperty("aadhaar") // Sensitive data should be excluded
        expect(submission).not.toHaveProperty("pan") // Sensitive data should be excluded
      }
    })
  })

  describe("GET /api/stats", () => {
    test("should return submission statistics", async () => {
      const response = await request(app).get("/api/stats").expect(200)

      expect(response.body).toMatchObject({
        success: true,
        message: "Statistics retrieved successfully",
        data: {
          total: expect.any(Number),
          pending: expect.any(Number),
          approved: expect.any(Number),
          rejected: expect.any(Number),
        },
      })
    })
  })

  describe("GET /api/health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200)

      expect(response.body).toMatchObject({
        success: true,
        message: "Server is healthy",
        data: {
          uptime: expect.any(Number),
          timestamp: expect.any(String),
          version: expect.any(String),
        },
      })
    })
  })

  describe("GET /", () => {
    test("should return API information", async () => {
      const response = await request(app).get("/").expect(200)

      expect(response.body).toMatchObject({
        success: true,
        message: "Udyam Registration Backend API",
        data: {
          version: expect.any(String),
          endpoints: expect.any(Array),
        },
      })
    })
  })

  describe("404 handling", () => {
    test("should return 404 for non-existent endpoints", async () => {
      const response = await request(app).get("/api/non-existent").expect(404)

      expect(response.body).toMatchObject({
        success: false,
        message: "Endpoint not found",
      })
    })
  })
})
