import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IFarmer, IBuyer, ICommodity, IGodown, IApiResponse } from '@mandi-erp/shared';

// -- Farmers --
export const useFarmers = () => {
  return useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IFarmer[]>>('/masters/farmers');
      return data.data;
    }
  });
};

export const useCreateFarmer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmer: IFarmer) => {
      const { data } = await apiClient.post<IApiResponse<IFarmer>>('/masters/farmers', farmer);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmers'] })
  });
};

// -- Buyers --
export const useBuyers = () => {
  return useQuery({
    queryKey: ['buyers'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IBuyer[]>>('/masters/buyers');
      return data.data;
    }
  });
};

export const useCreateBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (buyer: IBuyer) => {
      const { data } = await apiClient.post<IApiResponse<IBuyer>>('/masters/buyers', buyer);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buyers'] })
  });
};

// -- Commodities --
export const useCommodities = () => {
  return useQuery({
    queryKey: ['commodities'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<ICommodity[]>>('/masters/commodities');
      return data.data;
    }
  });
};

export const useCreateCommodity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commodity: ICommodity) => {
      const { data } = await apiClient.post<IApiResponse<ICommodity>>('/masters/commodities', commodity);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['commodities'] })
  });
};

// -- Godowns --
export const useGodowns = () => {
  return useQuery({
    queryKey: ['godowns'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IGodown[]>>('/masters/godowns');
      return data.data;
    }
  });
};

export const useCreateGodown = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (godown: IGodown) => {
      const { data } = await apiClient.post<IApiResponse<IGodown>>('/masters/godowns', godown);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['godowns'] })
  });
};
