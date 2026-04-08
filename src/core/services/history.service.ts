import { httpClient } from '@/core/lib/http-client';
import { refractHttpError } from '@/core/utils/http-error';
import { extractContent } from '@/core/utils/extract-content';
import { MessageHistoryType } from '@/core/models/history';

export const getMessageHistory = async (enterpriseId: string): Promise<MessageHistoryType[]> => {
  try {
    const response = await httpClient.get(`/api/v1/message/${enterpriseId}/all`);
    return extractContent<MessageHistoryType>(response);
  } catch (error) {
    return Promise.reject(refractHttpError(error));
  }
};