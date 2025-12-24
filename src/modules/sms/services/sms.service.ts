import type { SmsTransaction } from '../types/sms.types';

// Mock data for the last 30 days
const generateMockData = (): SmsTransaction[] => {
  const data: SmsTransaction[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const sent = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    const delivered = Math.floor(sent * (Math.random() * (0.98 - 0.92) + 0.92));
    data.push({
      date: date.toISOString().split('T')[0],
      sent,
      delivered,
    });
  }
  return data;
};

async function getSmsTransactions(): Promise<SmsTransaction[]> {
  // In a real application, you would fetch this from an API endpoint.
  // For now, we'll return mock data with a slight delay to simulate a network request.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateMockData());
    }, 500);
  });
}

export const smsService = {
  getSmsTransactions,
};
