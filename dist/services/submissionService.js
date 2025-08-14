"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = exports.submissionStorage = void 0;
const generators_1 = require("../utils/generators");
class SubmissionStorage {
    constructor() {
        this.submissions = [];
    }
    async create(formData) {
        const submission = {
            ...formData,
            id: (0, generators_1.generateId)(),
            registrationNumber: (0, generators_1.generateRegistrationNumber)(),
            submittedAt: new Date().toISOString(),
            status: "pending",
        };
        this.submissions.push(submission);
        return submission;
    }
    async findById(id) {
        return this.submissions.find((sub) => sub.id === id) || null;
    }
    async findByRegistrationNumber(regNumber) {
        return this.submissions.find((sub) => sub.registrationNumber === regNumber) || null;
    }
    async getAll() {
        return this.submissions;
    }
    async getStats() {
        return {
            total: this.submissions.length,
            pending: this.submissions.filter((s) => s.status === "pending").length,
            approved: this.submissions.filter((s) => s.status === "approved").length,
            rejected: this.submissions.filter((s) => s.status === "rejected").length,
        };
    }
}
exports.submissionStorage = new SubmissionStorage();
class SubmissionService {
    static async processSubmission(formData) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const submission = await exports.submissionStorage.create(formData);
        return submission;
    }
    static async getSubmissionStats() {
        return await exports.submissionStorage.getStats();
    }
    static async getAllSubmissions() {
        return await exports.submissionStorage.getAll();
    }
    static async getSubmissionById(id) {
        return await exports.submissionStorage.findById(id);
    }
}
exports.SubmissionService = SubmissionService;
//# sourceMappingURL=submissionService.js.map