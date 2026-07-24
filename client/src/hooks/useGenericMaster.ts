import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

export const createMasterHooks = <T extends { _id?: string }>(tableName: string, queryKey: string) => {
  const useGetAll = () => {
    return useQuery({
      queryKey: [queryKey],
      queryFn: async () => {
        return await (db as any)[tableName].toArray();
      }
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (payload: T) => {
        const newRecord = { ...payload, _id: uuidv4() };
        await (db as any)[tableName].add(newRecord);
        return newRecord;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload: Partial<T> }) => {
        await (db as any)[tableName].update(id, payload);
        const updated = await (db as any)[tableName].get(id);
        return updated;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        await (db as any)[tableName].delete(id);
        return null;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] })
    });
  };

  return { useGetAll, useCreate, useUpdate, useDelete };
};
