// Business logic for handling form submissions
import type { FormData, SubmissionRecord } from "../types"
import { generateRegistrationNumber, generateId } from "../utils/generators"

// In-memory storage (replace with database in production)
class SubmissionStorage {
  private submissions: SubmissionRecord[] = []

  async create(formData: FormData): Promise<SubmissionRecord> {
    const submission: SubmissionRecord = {
      ...formData,
      id: generateId(),
      registrationNumber: generateRegistrationNumber(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    }

    this.submissions.push(submission)
    return submission
  }

  async findById(id: string): Promise<SubmissionRecord | null> {
    return this.submissions.find((sub) => sub.id === id) || null
  }

  async findByRegistrationNumber(regNumber: string): Promise<SubmissionRecord | null> {
    return this.submissions.find((sub) => sub.registrationNumber === regNumber) || null
  }

  async getAll(): Promise<SubmissionRecord[]> {
    return this.submissions
  }

  async getStats() {
    return {
      total: this.submissions.length,
      pending: this.submissions.filter((s) => s.status === "pending").length,
      approved: this.submissions.filter((s) => s.status === "approved").length,
      rejected: this.submissions.filter((s) => s.status === "rejected").length,
    }
  }
}

export const submissionStorage = new SubmissionStorage()

// Business logic functions
export class SubmissionService {
  static async processSubmission(formData: FormData): Promise<SubmissionRecord> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Additional business validations can be added here
    // For example: check if Aadhaar/PAN already exists, validate OTP, etc.

    // Create and store submission
    const submission = await submissionStorage.create(formData)

    // In production, you might:
    // - Send confirmation email
    // - Trigger workflow processes
    // - Update external systems
    // - Generate PDF certificates

    return submission
  }

  static async getSubmissionStats() {
    return await submissionStorage.getStats()
  }

  static async getAllSubmissions() {
    return await submissionStorage.getAll()
  }

  static async getSubmissionById(id: string) {
    return await submissionStorage.findById(id)
  }
}
