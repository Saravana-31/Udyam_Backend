// Test setup and global configurations
import { jest } from "@jest/globals"

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Set test environment variables
process.env.NODE_ENV = "test"
process.env.PORT = "5001"
process.env.FRONTEND_URL = "http://localhost:3000"
