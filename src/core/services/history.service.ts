import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { MessageHistoryType } from '@/types/history';

export const getMessageHistory = async (enterpriseId: string): Promise<MessageHistoryType[]> => {
  try {
    const response = await httpClient.get<MessageHistoryType[]>(`/api/v1/message/${enterpriseId}/all`);
    console.log(response);
    return response;
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};