export interface ContactData {
  phoneNumber: string
  firstname?: string
  lastname?: string
  email?: string
  [key: string]: string | undefined
}

export interface ValidationError {
  row: number
  phoneNumber: string
  error: string
}

export interface FileValidationResult {
  isValid: boolean
  contacts: ContactData[]
  errors: ValidationError[]
  structureErrors: string[]
}
