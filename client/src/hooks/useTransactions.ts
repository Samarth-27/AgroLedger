import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../db/db';
import { IArrival, IDeal } from '@mandi-erp/shared';
import { v4 as uuidv4 } from 'uuid';

const generateCode = (prefix: string, count: number) => `${prefix}-${(count + 1).toString().padStart(4, '0')}`;

// -- Arrivals --
export const useArrivals = () => {
  return useQuery({
    queryKey: ['arrivals'],
    queryFn: async () => {
      const arrivals = await db.arrivals.toArray();
      // Populate farmer and commodity
      const populated = await Promise.all(arrivals.map(async (arr) => {
        const farmer = await db.farmers.get(arr.farmerId);
        const commodity = await db.commodities.get(arr.commodityId);
        return { ...arr, farmer, commodity };
      }));
      return populated;
    }
  });
};

export const useCreateArrival = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (arrival: Partial<IArrival>) => {
      const count = await db.arrivals.count();
      const newArrival = {
        ...arrival,
        _id: uuidv4(),
        arrivalNumber: generateCode('ARR', count),
        status: 'PENDING'
      } as IArrival;
      await db.arrivals.add(newArrival);
      return newArrival;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrivals'] })
  });
};

export const useDeleteArrival = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await db.arrivals.delete(id);
      return null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['arrivals'] })
  });
};

// -- Deals --
export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const deals = await db.deals.toArray();
      // Populate arrival and buyer
      const populated = await Promise.all(deals.map(async (deal) => {
        const arrival = await db.arrivals.get(deal.arrivalId);
        let populatedArrival = arrival;
        if (arrival) {
           const farmer = await db.farmers.get(arrival.farmerId);
           const commodity = await db.commodities.get(arrival.commodityId);
           populatedArrival = { ...arrival, farmer, commodity };
        }
        const buyer = await db.buyers.get(deal.buyerId);
        return { ...deal, arrival: populatedArrival, buyer };
      }));
      return populated;
    }
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deal: Partial<IDeal>) => {
      const count = await db.deals.count();
      const newDeal = {
        ...deal,
        _id: uuidv4(),
        dealNumber: generateCode('DEAL', count),
        status: 'CONFIRMED'
      } as IDeal;
      
      await db.transaction('rw', db.deals, db.arrivals, async () => {
        await db.deals.add(newDeal);
        if (deal.arrivalId) {
          await db.arrivals.update(deal.arrivalId, { status: 'AUCTIONED' });
        }
      });
      return newDeal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['arrivals'] });
    }
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await db.transaction('rw', db.deals, db.arrivals, async () => {
        const deal = await db.deals.get(id);
        if (deal && deal.arrivalId) {
          await db.arrivals.update(deal.arrivalId, { status: 'PENDING' });
        }
        await db.deals.delete(id);
      });
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['arrivals'] });
    }
  });
};
