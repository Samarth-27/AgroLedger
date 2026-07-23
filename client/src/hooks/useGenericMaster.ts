import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IApiResponse } from '@mandi-erp/shared';

export const createMasterHooks = <T>(endpoint: string, queryKey: string) => {
  const useGetAll = () => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        const { data } = await apiClient.get<IApiResponse<T[]>>(endpoint);
        return data.data;
      }
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (payload: T) => {
        const { data } = await apiClient.post<IApiResponse<T>>(endpoint, payload);
        return data.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload: Partial<T> }) => {
        const { data } = await apiClient.put<IApiResponse<T>>(`${endpoint}/${id}`, payload);
        return data.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        const { data } = await apiClient.delete<IApiResponse<null>>(`${endpoint}/${id}`);
        return data.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  };

  return { useGetAll, useCreate, useUpdate, useDelete };
};
