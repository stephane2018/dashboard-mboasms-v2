import { BaseEntity } from './common';
import { EnterpriseType } from './enterprise';

// Message Status enum
export enum MessageStatus {
  ACCEPTED = 'ACCEPTED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  DRAFT = 'DRAFT'
}

// Message History Type (complete API response)
export interface MessageHistoryType extends BaseEntity {
  message: string;
  enterprise: EnterpriseType;
  status: MessageStatus | string;
  sender: string;
  ticket: string | null;
  smsCount: number;
  msisdn: string;
  code: string;
  type: string;
}

// Simplified History Type (for UI display)
export interface HistoryType {
  id: string;
  content: string;
  receivers: string[];
  date: string;
  smsUsedCount: number;
  cost: number;
  status: string;
}
