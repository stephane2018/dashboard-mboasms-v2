/**
 * Phone number validation utilities for Cameroon
 * Supports all operators: MTN, Orange, Nexttel, Camtel
 * 
 * Reference: ITU numbering plan for Cameroon (+237)
 * All national numbers are 9 digits
 */

/**
 * Validates if a phone number is from Orange Cameroon
 * Orange prefixes: 655-659, 69
 */
export function isOrangePhoneNumber(phoneNumber: string): boolean {
  const regexOrange = /^(((00)?237)?|\+(237)?)(65[5-9]\d{6}|69\d{7})$/
  return regexOrange.test(phoneNumber)
}

/**
 * Validates if a phone number is from MTN Cameroon
 * MTN prefixes: 650-654, 67, 68
 */
export function isMTNPhoneNumber(phoneNumber: string): boolean {
  const regexMTN = /^(((00)?237)?|\+(237)?)(6(5[0-4]|[78])\d{6}|67\d{7})$/
  return regexMTN.test(phoneNumber)
}

/**
 * Validates if a phone number is from Nexttel
 * Nexttel prefixes: 66x, 685-689
 */
export function isNexttelPhoneNumber(phoneNumber: string): boolean {
  const regexNexttel = /^(((00)?237)?|\+(237)?)(66\d{7}|68[5-9]\d{6})$/
  return regexNexttel.test(phoneNumber)
}

/**
 * Validates if a phone number is from Camtel
 * Camtel prefixes: 24x, 620
 */
export function isCamtelPhoneNumber(phoneNumber: string): boolean {
  const regexCamtel = /^(((00)?237)?|\+(237)?)(24\d{7}|620\d{6})$/
  return regexCamtel.test(phoneNumber)
}

/**
 * Phone operator types
 */
export type PhoneOperator = "ORANGE" | "MTN" | "NEXTTEL" | "CAMTEL" | "UNKNOWN"

/**
 * Phone validation status
 */
export type PhoneValidationStatus = "CORRECT" | "INCORRECT"

/**
 * Validates a phone number and returns the operator
 * @param phoneNumber - The phone number to validate
 * @returns The operator name or "UNKNOWN" if invalid
 */
export function checkPhoneValidation(phoneNumber: string): PhoneOperator {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return "UNKNOWN"
  }

  // Trim whitespace
  const cleanedNumber = phoneNumber.trim()

  if (isOrangePhoneNumber(cleanedNumber)) {
    return "ORANGE"
  } else if (isMTNPhoneNumber(cleanedNumber)) {
    return "MTN"
  } else if (isNexttelPhoneNumber(cleanedNumber)) {
    return "NEXTTEL"
  } else if (isCamtelPhoneNumber(cleanedNumber)) {
    return "CAMTEL"
  }

  return "UNKNOWN"
}

/**
 * Checks if a phone number is valid (belongs to a known operator)
 * @param phoneNumber - The phone number to validate
 * @returns "CORRECT" if valid, "INCORRECT" if invalid
 */
export function getPhoneValidationStatus(phoneNumber: string): PhoneValidationStatus {
  const operator = checkPhoneValidation(phoneNumber)
  return operator === "UNKNOWN" ? "INCORRECT" : "CORRECT"
}

/**
 * Gets the badge variant for phone validation status
 * @param status - The validation status
 * @returns The badge variant
 */
export function getPhoneStatusBadgeVariant(status: PhoneValidationStatus): "default" | "secondary" | "destructive" {
  return status === "CORRECT" ? "default" : "destructive"
}

/**
 * Gets the badge color class for phone validation status
 * @param status - The validation status
 * @returns The CSS class for the badge
 */
export function getPhoneStatusColor(status: PhoneValidationStatus): string {
  return status === "CORRECT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
}
