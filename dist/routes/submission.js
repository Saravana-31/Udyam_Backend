"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../config/validation");
const submissionService_1 = require("../services/submissionService");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/submit", (0, middleware_1.rateLimiter)(10, 15 * 60 * 1000), async (req, res) => {
    try {
        console.log("📩 Received submission data:", req.body);
        const { isValid, errors, data } = (0, validation_1.validateFormData)(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
                timestamp: new Date().toISOString(),
            });
        }
        const submission = await submissionService_1.SubmissionService.processSubmission(data);
        console.log("✅ Processed submission:", submission);
        const submissions = await submissionService_1.SubmissionService.getAllSubmissions();
        const sanitizedSubmissions = submissions.map((sub) => ({
            id: sub.id,
            registrationNumber: sub.registrationNumber,
            name: sub.name,
            email: sub.email,
            orgType: sub.orgType,
            status: sub.status,
            submittedAt: sub.submittedAt,
        }));
        res.status(201).json({
            success: true,
            message: "Registration submitted successfully",
            data: {
                registrationNumber: submission.registrationNumber,
                submissionId: submission.id,
                submittedAt: submission.submittedAt,
                status: submission.status,
                allSubmissions: sanitizedSubmissions,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during submission",
            timestamp: new Date().toISOString(),
        });
    }
});
router.get("/submissions", async (req, res) => {
    try {
        const submissions = await submissionService_1.SubmissionService.getAllSubmissions();
        const sanitizedSubmissions = submissions.map((sub) => ({
            id: sub.id,
            registrationNumber: sub.registrationNumber,
            name: sub.name,
            email: sub.email,
            orgType: sub.orgType,
            status: sub.status,
            submittedAt: sub.submittedAt,
        }));
        res.json({
            success: true,
            message: "Submissions retrieved successfully",
            data: {
                total: submissions.length,
                submissions: sanitizedSubmissions,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Get submissions error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            timestamp: new Date().toISOString(),
        });
    }
});
router.get("/stats", async (req, res) => {
    try {
        const stats = await submissionService_1.SubmissionService.getSubmissionStats();
        res.json({
            success: true,
            message: "Statistics retrieved successfully",
            data: stats,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            timestamp: new Date().toISOString(),
        });
    }
});
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
        data: {
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || "1.0.0",
        },
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=submission.js.map