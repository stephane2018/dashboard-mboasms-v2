import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';

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
    try {
      const response = await httpClient.post<any>(`/api/v1/message/${idContact}/sendMessageToContact`, payload as unknown as Record<string, unknown>);
      console.log(response);
      return response;
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Send SMS message to all contacts in a group
   * POST /api/v1/message/sendMessageToGroup
   */
  async sendToGroup(payload: SendToGroupPayload) {
    try {
      const response = await httpClient.post<any>('/api/v1/message/sendMessageToGroup', payload as unknown as Record<string, unknown>);
      console.log(response);
      return response;
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },
};
