"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const submission_1 = __importDefault(require("./routes/submission"));
const middleware_1 = require("./middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 5000;
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use((0, cors_1.default)(middleware_1.corsOptions));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
if (process.env['NODE_ENV'] === "production") {
    app.use((0, morgan_1.default)("combined"));
}
else {
    app.use((0, morgan_1.default)("dev"));
    app.use(middleware_1.requestLogger);
}
app.use("/api", submission_1.default);
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
    });
});
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        timestamp: new Date().toISOString(),
    });
});
app.use(middleware_1.errorHandler);
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env['NODE_ENV'] || "development"}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
        console.log("Process terminated");
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map