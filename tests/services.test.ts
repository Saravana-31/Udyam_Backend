// Unit tests for service layer
import { SubmissionService } from "../src/services/submissionService"
import { validFormData } from "./utils/testData"

describe("SubmissionService Tests", () => {
  describe("processSubmission", () => {
    test("should process valid submission and return submission record", async () => {
      const result = await SubmissionService.processSubmission(validFormData)

      expect(result).toMatchObject({
        ...validFormData,
        id: expect.any(String),
        registrationNumber: expect.stringMatching(/^UDYAM-\d{8}-[A-Z0-9]{4}$/),
        submittedAt: expect.any(String),
        status: "pending",
      })

      // Verify ID format
      expect(result.id).toMatch(/^sub_\d+_[a-z0-9]{9}$/)

      // Verify timestamp is recent
      const submittedTime = new Date(result.submittedAt).getTime()
      const now = Date.now()
      expect(now - submittedTime).toBeLessThan(5000) // Within 5 seconds
    })

    test("should generate unique registration numbers", async () => {
      const results = await Promise.all([
        SubmissionService.processSubmission(validFormData),
        SubmissionService.processSubmission(validFormData),
        SubmissionService.processSubmission(validFormData),
      ])

      const registrationNumbers = results.map((r) => r.registrationNumber)
      const uniqueNumbers = new Set(registrationNumbers)

      expect(uniqueNumbers.size).toBe(3) // All should be unique
    })

    test("should generate unique submission IDs", async () => {
      const results = await Promise.all([
        SubmissionService.processSubmission(validFormData),
        SubmissionService.processSubmission(validFormData),
      ])

      expect(results[0].id).not.toBe(results[1].id)
    })
  })

  describe("getSubmissionStats", () => {
    test("should return correct statistics", async () => {
      // Submit some test data
      await SubmissionService.processSubmission(validFormData)
      await SubmissionService.processSubmission(validFormData)

      const stats = await SubmissionService.getSubmissionStats()

      expect(stats).toMatchObject({
        total: expect.any(Number),
        pending: expect.any(Number),
        approved: expect.any(Number),
        rejected: expect.any(Number),
      })

      expect(stats.total).toBeGreaterThanOrEqual(2)
      expect(stats.pending).toBeGreaterThanOrEqual(2)
      expect(stats.total).toBe(stats.pending + stats.approved + stats.rejected)
    })
  })

  describe("getAllSubmissions", () => {
    test("should return all submissions", async () => {
      const initialCount = (await SubmissionService.getAllSubmissions()).length

      await SubmissionService.processSubmission(validFormData)

      const submissions = await SubmissionService.getAllSubmissions()
      expect(submissions).toHaveLength(initialCount + 1)

      const latestSubmission = submissions[submissions.length - 1]
      expect(latestSubmission).toMatchObject({
        ...validFormData,
        id: expect.any(String),
        registrationNumber: expect.any(String),
        submittedAt: expect.any(String),
        status: "pending",
      })
    })
  })

  describe("getSubmissionById", () => {
    test("should return submission by ID", async () => {
      const submission = await SubmissionService.processSubmission(validFormData)
      const retrieved = await SubmissionService.getSubmissionById(submission.id)

      expect(retrieved).toEqual(submission)
    })

    test("should return null for non-existent ID", async () => {
      const retrieved = await SubmissionService.getSubmissionById("non-existent-id")
      expect(retrieved).toBeNull()
    })
  })
})
