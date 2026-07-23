import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IArrival, IDeal, IApiResponse } from '@mandi-erp/shared';

// -- Arrivals --
export const useArrivals = () => {
  return useQuery({
    queryKey: ['arrivals'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IArrival[]>>('/transactions/arrivals');
      return data.data;
    }
  });
};

export const useCreateArrival = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (arrival: Partial<IArrival>) => {
      const { data } = await apiClient.post<IApiResponse<IArrival>>('/transactions/arrivals', arrival);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrivals'] })
  });
};

export const useDeleteArrival = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<IApiResponse<null>>(`/transactions/arrivals/${id}`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrivals'] })
  });
};

// -- Deals --
export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IDeal[]>>('/transactions/deals');
      return data.data;
    }
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deal: Partial<IDeal>) => {
      const { data } = await apiClient.post<IApiResponse<IDeal>>('/transactions/deals', deal);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      // When a deal is created, the arrival status changes to AUCTIONED, so invalidate arrivals too
      queryClient.invalidateQueries({ queryKey: ['arrivals'] });
    }
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<IApiResponse<null>>(`/transactions/deals/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['arrivals'] });
    }
  });
};
