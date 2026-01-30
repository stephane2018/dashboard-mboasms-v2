import { httpClient } from '@/core/lib/http-client';
import type { EnterpriseContactResponseType, CreateContactRequestType, UpdateContactRequestType } from '@/core/models/contact-new';
import { groupsService } from '@/core/services/groups.service';
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
  async getContactsByEnterprise(enterpriseId: string, filters?: ContactFilters): Promise<EnterpriseContactResponseType[]> {
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
      return response as EnterpriseContactResponseType[];
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

  /**
   * Delete a contact
   * DELETE /api/v1/contact/{contactId}
   */
  async deleteContact(contactId: string, enterpriseId: string) {
    try {
      return await httpClient.delete(`/api/v1/contact/${contactId}`);
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Create a new contact
   * POST /api/v1/contact
   */
  async createContact(data: CreateContactRequestType) {
    try {
      return await httpClient.post('/api/v1/contact', data as unknown as Record<string, unknown>);
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Update a contact
   * PUT /api/v1/contact/{contactId}?id={contactId}
   */
  async updateContact(contactId: string, data: Partial<UpdateContactRequestType>) {
    try {
      return await httpClient.put(`/api/v1/contact/${contactId}?id=${contactId}`, data as unknown as Record<string, unknown>);
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Get all contacts with pagination
   * GET /api/v1/contact/all/{enterpriseId}?page={page}&size={size}
   */
  async getPaginatedAllContacts(page: number = 0, size: number = 10) {
    try {
      const response = await httpClient.get(`/api/v1/contact/all/enterprise?page=${page}&size=${size}`);
      return response;
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Get all contacts without pagination
   * GET /api/v1/contact/all/enterprise
   */
  async getAllContacts() {
    try {
      const response = await httpClient.get('/api/v1/contact/all/enterprise');
      return response;
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },

  /**
   * Get contacts by enterprise with pagination (alias for getPaginatedAllContacts)
   * GET /api/v1/contact/all/enterprise?page={page}&size={size}
   */
  async getContactsByEnterprisePage(page: number = 0, size: number = 10) {
    return this.getPaginatedAllContacts(page, size);
  },

  /**
   * Import contacts from file
   * POST /api/v1/contact/import
   */
  async importContacts(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await httpClient.post('/api/v1/contact/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      return Promise.reject(refractHttpError(error));
    }
  },
};

// Export individual methods for direct import
export const getPaginatedAllContacts = contactService.getPaginatedAllContacts.bind(contactService);
export const getAllContacts = contactService.getAllContacts.bind(contactService);
export const importContacts = contactService.importContacts.bind(contactService);
export const getContactsByEnterprisePage = contactService.getContactsByEnterprisePage.bind(contactService);
