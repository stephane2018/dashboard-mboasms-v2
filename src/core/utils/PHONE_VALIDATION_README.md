# Phone Number Validation for Cameroon

## Overview
This module provides comprehensive phone number validation for all Cameroon mobile and fixed-line operators.

## Supported Operators

### Mobile Operators
- **MTN Cameroon**: Prefixes 650-654, 67, 68
- **Orange Cameroon**: Prefixes 655-659, 69
- **Nexttel**: Prefixes 66x, 685-689
- **Camtel Mobile**: Prefixes 620, 24x

### Fixed-Line Operators
- **Camtel Fixed**: Prefixes 24x, 620

## Phone Number Format

### National Format
- All numbers: 9 digits
- Mobile: `6XXXXXXXX`
- Fixed: `2XXXXXXXX`

### International Format
- Country code: `+237`
- Example: `+237 6 XX XXX XXX` (mobile)
- Example: `+237 2 XX XXX XXX` (fixed)

### Accepted Input Formats
The validation functions accept multiple formats:
- National: `6XXXXXXXX` or `2XXXXXXXX`
- International: `+2376XXXXXXXX` or `+2372XXXXXXXX`
- With country code prefix: `00237XXXXXXXX`

## Usage

### Basic Validation

```typescript
import { 
  checkPhoneValidation, 
  getPhoneValidationStatus 
} from "@/core/utils/phone-validation"

// Check operator
const operator = checkPhoneValidation("679123456")
console.log(operator) // "MTN" | "ORANGE" | "NEXTTEL" | "CAMTEL" | "UNKNOWN"

// Check if valid
const status = getPhoneValidationStatus("679123456")
console.log(status) // "CORRECT" | "INCORRECT"
```

### Operator-Specific Validation

```typescript
import {
  isMTNPhoneNumber,
  isOrangePhoneNumber,
  isNexttelPhoneNumber,
  isCamtelPhoneNumber
} from "@/core/utils/phone-validation"

// Check specific operator
if (isMTNPhoneNumber("679123456")) {
  console.log("This is an MTN number")
}

if (isOrangePhoneNumber("+237691234567")) {
  console.log("This is an Orange number")
}
```

### In React Components

```typescript
import { 
  getPhoneValidationStatus, 
  checkPhoneValidation 
} from "@/core/utils/phone-validation"

export function PhoneStatusBadge({ phoneNumber }: { phoneNumber: string }) {
  const status = getPhoneValidationStatus(phoneNumber)
  const operator = checkPhoneValidation(phoneNumber)
  
  return (
    <div className="flex items-center gap-2">
      {status === "CORRECT" ? (
        <>
          <TickCircle className="text-green-600" />
          <Badge className="bg-green-100">{operator}</Badge>
        </>
      ) : (
        <>
          <CloseCircle className="text-red-600" />
          <Badge className="bg-red-100">Invalid</Badge>
        </>
      )}
    </div>
  )
}
```

## API Reference

### `checkPhoneValidation(phoneNumber: string): PhoneOperator`
Validates a phone number and returns the operator.

**Returns**: `"ORANGE" | "MTN" | "NEXTTEL" | "CAMTEL" | "UNKNOWN"`

**Example**:
```typescript
checkPhoneValidation("679123456") // "MTN"
checkPhoneValidation("invalid") // "UNKNOWN"
```

---

### `getPhoneValidationStatus(phoneNumber: string): PhoneValidationStatus`
Checks if a phone number is valid.

**Returns**: `"CORRECT" | "INCORRECT"`

**Example**:
```typescript
getPhoneValidationStatus("679123456") // "CORRECT"
getPhoneValidationStatus("invalid") // "INCORRECT"
```

---

### `isOrangePhoneNumber(phoneNumber: string): boolean`
Validates if a number belongs to Orange Cameroon.

---

### `isMTNPhoneNumber(phoneNumber: string): boolean`
Validates if a number belongs to MTN Cameroon.

---

### `isNexttelPhoneNumber(phoneNumber: string): boolean`
Validates if a number belongs to Nexttel.

---

### `isCamtelPhoneNumber(phoneNumber: string): boolean`
Validates if a number belongs to Camtel.

---

### `getPhoneStatusBadgeVariant(status: PhoneValidationStatus): BadgeVariant`
Returns the appropriate badge variant for UI display.

---

### `getPhoneStatusColor(status: PhoneValidationStatus): string`
Returns CSS classes for styling based on validation status.

## Integration with Data Table

The phone validation is already integrated into the contacts table with a "Phone Status" column that displays:
- ✓ Green badge with operator name for valid numbers
- ✗ Red badge with "Invalid" for invalid numbers

## Notes

- Due to phone number portability, the prefix is a good indicator but not 100% guaranteed to identify the operator
- All validation functions handle multiple input formats automatically
- Whitespace is automatically trimmed from input
- Invalid or empty inputs return "UNKNOWN" operator or "INCORRECT" status

## References

- ITU Numbering Plan for Cameroon
- Cameroon Telecom Regulatory Authority (ARCEP)
- Current as of 2025
