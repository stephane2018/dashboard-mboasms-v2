import { httpClient } from '@/core/lib/http-client';

export interface SendToContactPayload {
  message: string;
  enterpriseId: string;
  contacts: string;
  senderId: string;
  msisdn: string;
  smsCount: number;
}

export interface SendToGroupPayload {
  groupId: string;
  message: string;
  enterpriseId: string;
  contacts: string;
  senderId: string;
}

export const contactMessageService = {
  /**
   * Send SMS message to a single contact
   * POST /api/v1/message/{idContact}/sendMessageToContact
   */
  async sendToContact(idContact: string, payload: SendToContactPayload) {
    const response = await httpClient.post(`/api/v1/message/${idContact}/sendMessageToContact`, payload as unknown as Record<string, unknown>);
    return response as unknown;
  },

  /**
   * Send SMS message to all contacts in a group
   * POST /api/v1/message/sendMessageToGroup
   */
  async sendToGroup(payload: SendToGroupPayload) {
    const response = await httpClient.post('/api/v1/message/sendMessageToGroup', payload as unknown as Record<string, unknown>);
    return response as unknown;
  },
};
