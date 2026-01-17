export interface SmsTransaction {
  date: string; // e.g., "2023-11-23"
  sent: number;
  delivered: number;
}

export interface SendMessageParams {
  message: string
  senderId: string
  enterpriseId: string
  phoneNumbers: string
}

export interface SendMessageResponse {
  success: boolean
  message: string
  totalSent: number
  mtnSent?: number
  othersSent?: number
  details?: {
    mtn: { success: number; failed: number }
    others: { success: number; failed: number }
  }
}
