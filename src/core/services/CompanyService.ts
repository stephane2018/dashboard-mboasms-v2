import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { AddUserToEnterpriseRequestType, CreateCompanyRequestType, EnterpriseType, PaginatedCompaniesResponseType, UserType } from '../models';
import { EnterpriseContactResponseType } from '../models/contact';


export const getCompanies = async (): Promise<EnterpriseType[]> => {
  try {
    const response = await httpClient.get<EnterpriseType[]>('/api/v1/enterprise/all');
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getCompaniesPaginated = async (page: number = 0, size: number = 10): Promise<PaginatedCompaniesResponseType> => {
  try {
    const response = await httpClient.get<PaginatedCompaniesResponseType>('/api/v1/enterprise/all', {
      params: { page, size },
    });
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const createCompany = async (company: CreateCompanyRequestType): Promise<EnterpriseType> => {
  try {
    const response = await httpClient.post<EnterpriseType>('/api/v1/enterprise', company as Record<string, any>);
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const addUserToEnterprise = async (enterpriseId: string, user: AddUserToEnterpriseRequestType): Promise<UserType> => {
  try {
    const response = await httpClient.post<UserType>(
      `/api/v1/enterprise/adduser-enterprise/${enterpriseId}`,
      user as any
    );
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getCompanyContacts = async (enterpriseId: string, role: string): Promise<EnterpriseContactResponseType[]> => {
  try {
    console.log('with role:', role);
    const response = await httpClient.get<EnterpriseContactResponseType[]>(`/api/v1/contact/all/${enterpriseId}`);
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const getUpdatedCompanyInfo = async (userId: string): Promise<EnterpriseContactResponseType[]> => {
  try {
    const response = await httpClient.get<EnterpriseContactResponseType[]>(`/api/v1/enterprise/${userId}`);
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const updateCompany = async (id: string, company: CreateCompanyRequestType): Promise<EnterpriseType> => {
  try {
    const response = await httpClient.put<EnterpriseType>(`/api/v1/enterprise/${id}`, company as Record<string, any>);
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const response = await httpClient.delete<void>(`/api/v1/enterprise/${id}`);
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};
