import {
  checkPhoneValidation,
  getPhoneValidationStatus,
  isOrangePhoneNumber,
  isMTNPhoneNumber,
  isNexttelPhoneNumber,
  isCamtelPhoneNumber,
} from "../phone-validation"

describe("Phone Validation - MTN", () => {
  it("should validate MTN numbers with 67 prefix", () => {
    expect(isMTNPhoneNumber("679123456")).toBe(true)
    expect(isMTNPhoneNumber("+237679123456")).toBe(true)
    expect(isMTNPhoneNumber("00237679123456")).toBe(true)
  })

  it("should validate MTN numbers with 68 prefix", () => {
    expect(isMTNPhoneNumber("680123456")).toBe(true)
    expect(isMTNPhoneNumber("681123456")).toBe(true)
  })

  it("should validate MTN numbers with 650-654 prefix", () => {
    expect(isMTNPhoneNumber("650123456")).toBe(true)
    expect(isMTNPhoneNumber("654123456")).toBe(true)
  })

  it("should return MTN for valid MTN numbers", () => {
    expect(checkPhoneValidation("679123456")).toBe("MTN")
    expect(checkPhoneValidation("+237679123456")).toBe("MTN")
  })
})

describe("Phone Validation - Orange", () => {
  it("should validate Orange numbers with 69 prefix", () => {
    expect(isOrangePhoneNumber("691234567")).toBe(true)
    expect(isOrangePhoneNumber("+237691234567")).toBe(true)
  })

  it("should validate Orange numbers with 655-659 prefix", () => {
    expect(isOrangePhoneNumber("655123456")).toBe(true)
    expect(isOrangePhoneNumber("659123456")).toBe(true)
  })

  it("should return ORANGE for valid Orange numbers", () => {
    expect(checkPhoneValidation("691234567")).toBe("ORANGE")
    expect(checkPhoneValidation("+237691234567")).toBe("ORANGE")
  })
})

describe("Phone Validation - Nexttel", () => {
  it("should validate Nexttel numbers with 66 prefix", () => {
    expect(isNexttelPhoneNumber("661234567")).toBe(true)
    expect(isNexttelPhoneNumber("+237661234567")).toBe(true)
  })

  it("should validate Nexttel numbers with 685-689 prefix", () => {
    expect(isNexttelPhoneNumber("685123456")).toBe(true)
    expect(isNexttelPhoneNumber("689123456")).toBe(true)
  })

  it("should return NEXTTEL for valid Nexttel numbers", () => {
    expect(checkPhoneValidation("661234567")).toBe("NEXTTEL")
    expect(checkPhoneValidation("+237661234567")).toBe("NEXTTEL")
  })
})

describe("Phone Validation - Camtel", () => {
  it("should validate Camtel numbers with 24 prefix", () => {
    expect(isCamtelPhoneNumber("241234567")).toBe(true)
    expect(isCamtelPhoneNumber("+237241234567")).toBe(true)
  })

  it("should validate Camtel numbers with 620 prefix", () => {
    expect(isCamtelPhoneNumber("620123456")).toBe(true)
    expect(isCamtelPhoneNumber("+237620123456")).toBe(true)
  })

  it("should return CAMTEL for valid Camtel numbers", () => {
    expect(checkPhoneValidation("241234567")).toBe("CAMTEL")
    expect(checkPhoneValidation("+237241234567")).toBe("CAMTEL")
  })
})

describe("Phone Validation - Invalid Numbers", () => {
  it("should return UNKNOWN for invalid numbers", () => {
    expect(checkPhoneValidation("123456789")).toBe("UNKNOWN")
    expect(checkPhoneValidation("invalid")).toBe("UNKNOWN")
    expect(checkPhoneValidation("")).toBe("UNKNOWN")
  })

  it("should return INCORRECT status for invalid numbers", () => {
    expect(getPhoneValidationStatus("123456789")).toBe("INCORRECT")
    expect(getPhoneValidationStatus("invalid")).toBe("INCORRECT")
  })
})

describe("Phone Validation - Valid Numbers", () => {
  it("should return CORRECT status for valid numbers", () => {
    expect(getPhoneValidationStatus("679123456")).toBe("CORRECT")
    expect(getPhoneValidationStatus("691234567")).toBe("CORRECT")
    expect(getPhoneValidationStatus("661234567")).toBe("CORRECT")
    expect(getPhoneValidationStatus("241234567")).toBe("CORRECT")
  })
})

describe("Phone Validation - Format Handling", () => {
  it("should handle international format", () => {
    expect(checkPhoneValidation("+237679123456")).toBe("MTN")
    expect(checkPhoneValidation("+237691234567")).toBe("ORANGE")
  })

  it("should handle 00237 prefix format", () => {
    expect(checkPhoneValidation("00237679123456")).toBe("MTN")
    expect(checkPhoneValidation("00237691234567")).toBe("ORANGE")
  })

  it("should handle national format", () => {
    expect(checkPhoneValidation("679123456")).toBe("MTN")
    expect(checkPhoneValidation("691234567")).toBe("ORANGE")
  })

  it("should handle whitespace", () => {
    expect(checkPhoneValidation("  679123456  ")).toBe("MTN")
    expect(checkPhoneValidation("  +237691234567  ")).toBe("ORANGE")
  })
})

describe("Phone Validation - Edge Cases", () => {
  it("should handle null or undefined gracefully", () => {
    expect(checkPhoneValidation(null as any)).toBe("UNKNOWN")
    expect(checkPhoneValidation(undefined as any)).toBe("UNKNOWN")
  })

  it("should handle non-string types", () => {
    expect(checkPhoneValidation(123456789 as any)).toBe("UNKNOWN")
  })
})
