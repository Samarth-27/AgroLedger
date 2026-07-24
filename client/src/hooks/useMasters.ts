import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../db/db';
import { IFarmer, IBuyer, ICommodity, IGodown } from '@mandi-erp/shared';
import { v4 as uuidv4 } from 'uuid';

const generateCode = (prefix: string, count: number) => `${prefix}-${(count + 1).toString().padStart(4, '0')}`;

// -- Farmers --
export const useFarmers = () => {
  return useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      return await db.farmers.toArray();
    }
  });
};

export const useCreateFarmer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmer: IFarmer) => {
      const count = await db.farmers.count();
      const newFarmer = {
        ...farmer,
        _id: uuidv4(),
        code: generateCode('F', count)
      };
      await db.farmers.add(newFarmer);
      return newFarmer;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farmers'] })
  });
};

// -- Buyers --
export const useBuyers = () => {
  return useQuery({
    queryKey: ['buyers'],
    queryFn: async () => {
      return await db.buyers.toArray();
    }
  });
};

export const useCreateBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (buyer: IBuyer) => {
      const count = await db.buyers.count();
      const newBuyer = {
        ...buyer,
        _id: uuidv4(),
        code: generateCode('B', count)
      };
      await db.buyers.add(newBuyer);
      return newBuyer;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['buyers'] })
  });
};

// -- Commodities --
export const useCommodities = () => {
  return useQuery({
    queryKey: ['commodities'],
    queryFn: async () => {
      return await db.commodities.toArray();
    }
  });
};

export const useCreateCommodity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commodity: ICommodity) => {
      const newCommodity = {
        ...commodity,
        _id: uuidv4()
      };
      await db.commodities.add(newCommodity);
      return newCommodity;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['commodities'] })
  });
};

// -- Godowns --
export const useGodowns = () => {
  return useQuery({
    queryKey: ['godowns'],
    queryFn: async () => {
      return await db.godowns.toArray();
    }
  });
};

export const useCreateGodown = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (godown: IGodown) => {
      const newGodown = {
        ...godown,
        _id: uuidv4()
      };
      await db.godowns.add(newGodown);
      return newGodown;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['godowns'] })
  });
};
