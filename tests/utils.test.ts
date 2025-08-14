// Unit tests for utility functions
import { generateId, generateRegistrationNumber, formatDate, sanitizeString } from "../src/utils/generators"

describe("Utility Functions Tests", () => {
  describe("generateId", () => {
    test("should generate unique IDs", () => {
      const ids = Array(100)
        .fill(null)
        .map(() => generateId())
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(100) // All should be unique
    })

    test("should follow correct format", () => {
      const id = generateId()
      expect(id).toMatch(/^sub_\d+_[a-z0-9]{9}$/)
    })
  })

  describe("generateRegistrationNumber", () => {
    test("should generate unique registration numbers", () => {
      const numbers = Array(100)
        .fill(null)
        .map(() => generateRegistrationNumber())
      const uniqueNumbers = new Set(numbers)

      expect(uniqueNumbers.size).toBe(100) // All should be unique
    })

    test("should follow correct format", () => {
      const regNumber = generateRegistrationNumber()
      expect(regNumber).toMatch(/^UDYAM-\d{8}-[A-Z0-9]{4}$/)
    })
  })

  describe("formatDate", () => {
    test("should format date correctly", () => {
      const date = new Date("2023-12-25T10:30:00Z")
      const formatted = formatDate(date)
      expect(formatted).toBe("2023-12-25")
    })
  })

  describe("sanitizeString", () => {
    test("should remove dangerous characters", () => {
      const input = '<script>alert("xss")</script>Hello World'
      const sanitized = sanitizeString(input)
      expect(sanitized).toBe('scriptalert("xss")/scriptHello World')
    })

    test("should trim whitespace", () => {
      const input = "  Hello World  "
      const sanitized = sanitizeString(input)
      expect(sanitized).toBe("Hello World")
    })
  })
})
