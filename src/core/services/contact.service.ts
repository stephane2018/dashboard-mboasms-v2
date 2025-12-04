import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import {
    EnterpriseContactType,
    EnterpriseContactResponseType,
    CreateContactRequestType,
    UpdateContactRequestType,
    PaginatedEnterpriseContactsResponseType,
    ImportContactsType
} from '../models/contact-new';

/**
 * Get all contacts
 * GET /api/v1/contact/all
 */
export const getAllContacts = async (): Promise<EnterpriseContactResponseType[]> => {
    try {
        const response = await httpClient.get<EnterpriseContactResponseType[]>('/api/v1/contact/all');
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getAllContactsByEnterprise = async (enterpriseId: string): Promise<EnterpriseContactResponseType[]> => {
    try {
        const response = await httpClient.get<EnterpriseContactResponseType[]>(`/api/v1/contact/all/${enterpriseId}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Get paginated contacts by enterprise
 * GET /api/v1/contact/all/byEnterprisePage?page={page}&size={size}&enterpriseId={enterpriseId}
 */
export const getContactsByEnterprisePage = async (
    enterpriseId: string,
    page: number = 0,
    size: number = 10
): Promise<PaginatedEnterpriseContactsResponseType> => {
    try {
        const response = await httpClient.get<PaginatedEnterpriseContactsResponseType>(
            `/api/v1/contact/all/byEnterprisePage`,
            {
                params: {
                    page,
                    size,
                    enterpriseId
                }
            }
        );
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Get contact by ID
 * GET /api/v1/contact/{id}
 */
export const getContactById = async (id: string): Promise<EnterpriseContactResponseType> => {
    try {
        const response = await httpClient.get<EnterpriseContactResponseType>(`/api/v1/contact/${id}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Create a new contact
 * POST /api/v1/contact
 */
export const createContact = async (data: CreateContactRequestType): Promise<EnterpriseContactResponseType> => {
    try {
        const response = await httpClient.post<EnterpriseContactResponseType>('/api/v1/contact', data as any);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Update an existing contact
 * PUT /api/v1/contact/{id}
 */
export const updateContact = async (
    id: string,
    data: Partial<UpdateContactRequestType>
): Promise<EnterpriseContactResponseType> => {
    try {
        const response = await httpClient.post<EnterpriseContactResponseType>(`/api/v1/contact`, data);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Delete a contact
 * DELETE /api/v1/contact/{contactId}
 */
export const deleteContact = async (contactId: string): Promise<any> => {
    try {
        const response = await httpClient.delete(`/api/v1/contact/${contactId}`);
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

/**
 * Import contacts from file
 * POST /api/v1/contact/importContact
 */
export const importContacts = async (file: File, enterpriseId: string): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('enterpriseId', enterpriseId);

        const response = await httpClient.post('/api/v1/contact/importContact', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};
