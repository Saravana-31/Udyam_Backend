// Test data and utilities for consistent testing
import type { FormData } from "../../src/types"

export const validFormData: FormData = {
  // Step 1 fields
  aadhaar: "123456789012",
  name: "John Doe",
  mobile: "9876543210",
  email: "john.doe@example.com",
  otp: "123456",
  // Step 2 fields
  pan: "ABCDE1234F",
  panName: "John Doe",
  orgType: "Proprietorship",
  incDate: "2020-01-15",
}

export const invalidFormData = {
  aadhaar: "12345", // Too short
  name: "", // Empty
  mobile: "987654321", // Too short
  email: "invalid-email", // Invalid format
  otp: "12345", // Too short
  pan: "INVALID", // Wrong format
  panName: "A", // Too short
  orgType: "InvalidType", // Not in allowed values
  incDate: "2030-01-01", // Future date
}

export const partialFormData = {
  aadhaar: "123456789012",
  name: "John Doe",
  mobile: "9876543210",
  // Missing email, otp, and step 2 fields
}

// Test cases for specific validations
export const aadhaarTestCases = [
  { value: "123456789012", valid: true, description: "valid 12-digit Aadhaar" },
  { value: "12345678901", valid: false, description: "too short Aadhaar" },
  { value: "1234567890123", valid: false, description: "too long Aadhaar" },
  { value: "12345678901a", valid: false, description: "Aadhaar with letters" },
  { value: "", valid: false, description: "empty Aadhaar" },
  { value: "000000000000", valid: true, description: "all zeros Aadhaar (technically valid format)" },
]

export const panTestCases = [
  { value: "ABCDE1234F", valid: true, description: "valid PAN format" },
  { value: "abcde1234f", valid: false, description: "lowercase PAN" },
  { value: "ABCDE1234", valid: false, description: "missing last letter" },
  { value: "ABCD1234F", valid: false, description: "missing one letter at start" },
  { value: "ABCDE123F", valid: false, description: "missing one digit" },
  { value: "ABCDE12345F", valid: false, description: "extra digit" },
  { value: "12345ABCDF", valid: false, description: "wrong pattern" },
  { value: "", valid: false, description: "empty PAN" },
]

export const mobileTestCases = [
  { value: "9876543210", valid: true, description: "valid 10-digit mobile" },
  { value: "987654321", valid: false, description: "too short mobile" },
  { value: "98765432101", valid: false, description: "too long mobile" },
  { value: "987654321a", valid: false, description: "mobile with letters" },
  { value: "", valid: false, description: "empty mobile" },
  { value: "0000000000", valid: true, description: "all zeros mobile (technically valid format)" },
]
