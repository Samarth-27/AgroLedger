import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IApiResponse } from '@mandi-erp/shared';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<any>>('/dashboard/summary');
      return data.data;
    }
  });
};
