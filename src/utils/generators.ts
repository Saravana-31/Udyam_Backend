// Utility functions for generating IDs and registration numbers
export const generateId = (): string => {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const generateRegistrationNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `UDYAM-${timestamp}-${random}`
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, "")
}
