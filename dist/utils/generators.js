"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = exports.sanitizeString = exports.formatDate = exports.generateRegistrationNumber = exports.generateId = void 0;
const generateId = () => {
    return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};
exports.generateId = generateId;
const generateRegistrationNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `UDYAM-${timestamp}-${random}`;
};
exports.generateRegistrationNumber = generateRegistrationNumber;
const formatDate = (date) => {
    return date.toISOString().split("T")[0];
};
exports.formatDate = formatDate;
const sanitizeString = (str) => {
    if (!str)
        return "";
    return str.trim().replace(/[<>]/g, "");
};
exports.sanitizeString = sanitizeString;
const getEnvVar = (key) => {
    return process.env[key] ?? "";
};
exports.getEnvVar = getEnvVar;
//# sourceMappingURL=generators.js.map