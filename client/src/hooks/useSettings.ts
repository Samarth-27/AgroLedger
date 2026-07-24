import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../db/db';
import { ISystemSetting } from '@mandi-erp/shared';
import { v4 as uuidv4 } from 'uuid';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const settings = await db.settings.toArray();
      // Provide default settings if empty
      if (settings.length === 0) {
        const defaultSettings: ISystemSetting[] = [
          { _id: uuidv4(), key: 'PALLEDARI_RATE_PER_BAG', value: 2, description: 'Labour rate for unloading' },
          { _id: uuidv4(), key: 'HAMALI_RATE_PER_BAG', value: 3, description: 'Labour rate for loading' },
          { _id: uuidv4(), key: 'TULAI_RATE_PER_BAG', value: 1, description: 'Labour rate for weighing' }
        ];
        await db.settings.bulkAdd(defaultSettings);
        return defaultSettings;
      }
      return settings;
    }
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const existing = await db.settings.where('key').equals(key).first();
      if (existing) {
        await db.settings.update(existing._id, { value });
        return { ...existing, value };
      } else {
        const newSetting = { _id: uuidv4(), key, value, description: 'Custom setting' };
        await db.settings.add(newSetting);
        return newSetting;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });
};
