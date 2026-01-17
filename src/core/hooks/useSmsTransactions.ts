import { useQuery } from '@tanstack/react-query';
import { smsService } from '@/core/services/sms.service';

export function useSmsTransactions() {
  return useQuery({
    queryKey: ['smsTransactions'],
    queryFn: smsService.getSmsTransactions,
  });
}
