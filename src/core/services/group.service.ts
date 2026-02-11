import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { AddContactsToGroupType, CreateGroupType, GroupType } from '@/core/models/groups';

type UpdateGroupInput = Partial<CreateGroupType> & { enterpriseId?: string }

export const getGroups = async (): Promise<GroupType[]> => {
    try {
        const response = await httpClient.get<GroupType[]>(`/api/v1/group/all`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const getGroupByEnterprise = async (enterpriseId: string): Promise<GroupType[]> => {
    try {
        const response = await httpClient.get<GroupType[]>(`/api/v1/group/all/${enterpriseId}`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const createGroup = async (data: CreateGroupType): Promise<GroupType> => {
    try {
        const response = await httpClient.post<GroupType>('/api/v1/group/save', data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const updateGroup = async (groupId: string, data: UpdateGroupInput): Promise<GroupType> => {
    try {
        const response = await httpClient.put<GroupType>(`/api/v1/group/${groupId}`, data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const addContactToGroup = async (groupId: string, data: Partial<AddContactsToGroupType>): Promise<AddContactsToGroupType> => {
    try {
        const response = await httpClient.put<AddContactsToGroupType>(`/api/v1/group/addContact/${groupId}`, data);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const deleteGroup = async (groupId: string): Promise<any> => {
    try {
        const response = await httpClient.delete(`/api/v1/group/${groupId}`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const addContactsToGroup = async (groupId: string, listContactid: string[]): Promise<GroupType> => {
    try {
        const response = await httpClient.put<GroupType>(
            `/api/v1/group/addContact/${groupId}`,
            { listContactid }
        );
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};

export const removeContactFromGroup = async (groupId: string): Promise<any> => {
    try {
        const response = await httpClient.post(`/api/v1/group/deleteContact/${groupId}`);
        return response;
    } catch (error) {
        return Promise.reject(refractHttpError(error));
    }
};