// Unit tests for validation functions
import { validateFormData } from "../src/config/validation"
import { validFormData, invalidFormData, aadhaarTestCases, panTestCases, mobileTestCases } from "./utils/testData"

describe("Form Validation Tests", () => {
  describe("Aadhaar Validation", () => {
    test.each(aadhaarTestCases)("should validate $description", ({ value, valid }) => {
      const testData = { ...validFormData, aadhaar: value }
      const { isValid, errors } = validateFormData(testData)

      if (valid) {
        expect(errors?.aadhaar).toBeUndefined()
      } else {
        expect(isValid).toBe(false)
        expect(errors?.aadhaar).toBeDefined()
        expect(errors?.aadhaar).toMatch(/aadhaar|required/i)
      }
    })

    test("should provide specific error message for invalid Aadhaar format", () => {
      const testData = { ...validFormData, aadhaar: "12345" }
      const { isValid, errors } = validateFormData(testData)

      expect(isValid).toBe(false)
      expect(errors?.aadhaar).toBe("Aadhaar must be exactly 12 digits")
    })

    test("should require Aadhaar field", () => {
      const testData = { ...validFormData, aadhaar: "" }
      const { isValid, errors } = validateFormData(testData)

      expect(isValid).toBe(false)
      expect(errors?.aadhaar).toBe("Aadhaar Number is required")
    })
  })

  describe("PAN Validation", () => {
    test.each(panTestCases)("should validate $description", ({ value, valid }) => {
      const testData = { ...validFormData, pan: value }
      const { isValid, errors } = validateFormData(testData)

      if (valid) {
        expect(errors?.pan).toBeUndefined()
      } else {
        expect(isValid).toBe(false)
        expect(errors?.pan).toBeDefined()
        expect(errors?.pan).toMatch(/pan|required/i)
      }
    })

    test("should provide specific error message for invalid PAN format", () => {
      const testData = { ...validFormData, pan: "INVALID" }
      const { isValid, errors } = validateFormData(testData)

      expect(isValid).toBe(false)
      expect(errors?.pan).toBe("PAN format should be ABCDE1234F (5 letters, 4 digits, 1 letter)")
    })

    test("should require PAN field", () => {
      const testData = { ...validFormData, pan: "" }
      const { isValid, errors } = validateFormData(testData)

      expect(isValid).toBe(false)
      expect(errors?.pan).toBe("PAN Number is required")
    })
  })

  describe("Mobile Validation", () => {
    test.each(mobileTestCases)("should validate $description", ({ value, valid }) => {
      const testData = { ...validFormData, mobile: value }
      const { isValid, errors } = validateFormData(testData)

      if (valid) {
        expect(errors?.mobile).toBeUndefined()
      } else {
        expect(isValid).toBe(false)
        expect(errors?.mobile).toBeDefined()
      }
    })
  })

  describe("Full Form Validation", () => {
    test("should pass validation with complete valid data", () => {
      const { isValid, errors, data } = validateFormData(validFormData)

      expect(isValid).toBe(true)
      expect(errors).toBeNull()
      expect(data).toEqual(expect.objectContaining(validFormData))
    })

    test("should fail validation with multiple invalid fields", () => {
      const { isValid, errors } = validateFormData(invalidFormData)

      expect(isValid).toBe(false)
      expect(errors).toBeDefined()
      expect(Object.keys(errors!)).toHaveLength(9) // All fields should have errors

      // Check specific error messages
      expect(errors?.aadhaar).toContain("12 digits")
      expect(errors?.name).toContain("required")
      expect(errors?.mobile).toContain("10 digits")
      expect(errors?.email).toContain("valid email")
      expect(errors?.otp).toContain("6 digits")
      expect(errors?.pan).toContain("ABCDE1234F")
      expect(errors?.panName).toContain("2 characters")
      expect(errors?.orgType).toContain("one of:")
      expect(errors?.incDate).toContain("future")
    })

    test("should validate email format correctly", () => {
      const testCases = [
        { email: "valid@example.com", valid: true },
        { email: "user.name+tag@example.co.uk", valid: true },
        { email: "invalid-email", valid: false },
        { email: "@example.com", valid: false },
        { email: "user@", valid: false },
        { email: "", valid: false },
      ]

      testCases.forEach(({ email, valid }) => {
        const testData = { ...validFormData, email }
        const { isValid, errors } = validateFormData(testData)

        if (valid) {
          expect(errors?.email).toBeUndefined()
        } else {
          expect(isValid).toBe(false)
          expect(errors?.email).toBeDefined()
        }
      })
    })

    test("should validate organization types", () => {
      const validOrgTypes = ["Proprietorship", "Partnership", "Private Limited", "LLP"]
      const invalidOrgTypes = ["Corporation", "Trust", "Society", ""]

      validOrgTypes.forEach((orgType) => {
        const testData = { ...validFormData, orgType }
        const { isValid, errors } = validateFormData(testData)
        expect(errors?.orgType).toBeUndefined()
      })

      invalidOrgTypes.forEach((orgType) => {
        const testData = { ...validFormData, orgType }
        const { isValid, errors } = validateFormData(testData)
        expect(isValid).toBe(false)
        expect(errors?.orgType).toBeDefined()
      })
    })

    test("should validate date constraints", () => {
      const today = new Date()
      const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
      const pastDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

      // Future date should be invalid
      const futureTestData = { ...validFormData, incDate: futureDate.toISOString().split("T")[0] }
      const futureResult = validateFormData(futureTestData)
      expect(futureResult.isValid).toBe(false)
      expect(futureResult.errors?.incDate).toContain("future")

      // Past date should be valid
      const pastTestData = { ...validFormData, incDate: pastDate.toISOString().split("T")[0] }
      const pastResult = validateFormData(pastTestData)
      expect(pastResult.errors?.incDate).toBeUndefined()
    })

    test("should strip unknown fields", () => {
      const dataWithUnknownFields = {
        ...validFormData,
        unknownField: "should be removed",
        anotherUnknown: 123,
      }

      const { isValid, data } = validateFormData(dataWithUnknownFields)

      expect(isValid).toBe(true)
      expect(data).not.toHaveProperty("unknownField")
      expect(data).not.toHaveProperty("anotherUnknown")
    })
  })
})
