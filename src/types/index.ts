// Type definitions for the backend API
export interface FormData {
  // Step 1 fields
  aadhaar: string
  name: string
  mobile: string
  email: string
  otp: string
  // Step 2 fields
  pan: string
  panName: string
  orgType: string
  incDate: string
  // Additional fields
  pincode?: string
  city?: string
  state?: string
}

export interface FormField {
  label: string
  type: "text" | "email" | "select" | "date"
  name: string
  pattern?: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string> | undefined
  timestamp: string
}

export interface SubmissionRecord extends FormData {
  id: string
  registrationNumber: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
}
