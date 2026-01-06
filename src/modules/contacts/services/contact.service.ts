import { httpClient } from '@/core/lib/http-client';
import type { EnterpriseContactResponseType } from '@/core/models/contact-new';
import { groupsService } from '@/modules/groups/services';
import { refractHttpError } from '@/core/utils/http-error';

export interface ContactFilters {
  contactType?: string;
  page?: number;
  size?: number;
}

export const contactService = {
  /**
   * Get all contacts for an enterprise
   * GET /api/v1/contact/all/{enterpriseId}
   */
  async getContactsByEnterprise(enterpriseId: string, filters?: ContactFilters) {
    try {
      const params = new URLSearchParams();

      if (filters?.contactType) {
        params.append('contactType', filters.contactType);
      }
      if (filters?.page !== undefined) {
        params.append('page', filters.page.toString());
      }
      if (filters?.size !== undefined) {
        params.append('size', filters.size.toString());
      }

      const url = params.toString()
        ? `/api/v1/contact/all/${enterpriseId}?${params.toString()}`
        : `/api/v1/contact/all/${enterpriseId}`;

      const response = await httpClient.get(url);
      return response as unknown;
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Get contacts by group
   * Fetches all enterprise contacts and filters by group contacts
   */
  async getContactsByGroup(groupId: string, enterpriseId: string) {
    try {
      // First get the group to know which contacts belong to it
      const group = await groupsService.getGroupById(groupId);

      // Get all contacts from the enterprise using the provided enterpriseId
      const allContacts = await this.getContactsByEnterprise(enterpriseId) as any;

      // Extract contact IDs from the group
      const groupContactIds = new Set(
        (group.enterpriseContacts || []).map((c) => c.id)
      );

      // Filter enterprise contacts to only include those in the group
      const contacts = Array.isArray(allContacts)
        ? allContacts.filter((contact: any) => groupContactIds.has(contact.id))
        : [];
      console.log(contacts);
      return {
        contacts,
        groupInfo: {
          id: group.id,
          name: group.name,
          code: group.code,
          enterprise: group.enterprise || enterpriseId,
        }
      };
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },
};
