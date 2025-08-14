// src/utils/generators.ts
/**
 * Utility functions for generating IDs, registration numbers,
 * formatting dates, and sanitizing strings.
 */

/**
 * Generate a unique submission ID
 * Format: sub_<timestamp>_<randomString>
 */
export const generateId = (): string => {
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Generate a UDYAM registration number
 * Format: UDYAM-<last8Timestamp>-<4CharRandom>
 */
export const generateRegistrationNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UDYAM-${timestamp}-${random}`;
};

/**
 * Format a date (Date object or string) to YYYY-MM-DD
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return ""; // Invalid date -> empty string
  return dateObj.toISOString().split("T")[0] || "";
};


/**
 * Sanitize a string by trimming and removing potentially unsafe characters
 */
export const sanitizeString = (str: string | undefined | null): string => {
  if (!str) return "";
  return str.trim().replace(/[<>]/g, "");
};

/**
 * Get environment variable safely
 * Returns a string, defaults to empty string if undefined
 */

export const getEnvVar = (key: string): string => {
  return process.env[key] ?? "";
};

