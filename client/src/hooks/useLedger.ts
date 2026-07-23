import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IApiResponse } from '@mandi-erp/shared';

export const useTrialBalance = () => {
  return useQuery({
    queryKey: ['trial-balance'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<any[]>>('/accounting/trial-balance');
      return data.data;
    }
  });
};

export const useAccountLedger = (accountId?: string, partyId?: string) => {
  return useQuery({
    queryKey: ['ledger', accountId, partyId],
    queryFn: async () => {
      let url = '/accounting/transactions';
      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      if (partyId) params.append('partyId', partyId);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const { data } = await apiClient.get<IApiResponse<any[]>>(url);
      return data.data;
    }
  });
};
