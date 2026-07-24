import { useQuery } from '@tanstack/react-query';
import { db } from '../db/db';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const todayStr = new Date().toISOString().split('T')[0];

      // Arrivals
      const allArrivals = await db.arrivals.toArray();
      let dailyArrivalsCount = 0;
      let dailyArrivalsWeight = 0;
      
      const commodityMap: Record<string, number> = {};

      for (const a of allArrivals) {
        if (new Date(a.date).toISOString().split('T')[0] === todayStr) {
          dailyArrivalsCount++;
          dailyArrivalsWeight += a.weight;
        }
        
        // Aggregate for chart
        const c = await db.commodities.get(a.commodityId);
        if (c) {
          commodityMap[c.name] = (commodityMap[c.name] || 0) + a.weight;
        }
      }

      const arrivalsByCommodity = Object.entries(commodityMap).map(([name, value]) => ({ name, value }));

      // Deals
      const allDeals = await db.deals.toArray();
      let dailyDealsCount = 0;
      const recentDeals = [];

      for (const d of allDeals) {
        if (new Date(d.date).toISOString().split('T')[0] === todayStr) {
          dailyDealsCount++;
        }
      }

      // Populate recent 5 deals
      const sortedDeals = allDeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      for (const d of sortedDeals) {
        const buyer = await db.buyers.get(d.buyerId);
        const arrival = await db.arrivals.get(d.arrivalId);
        const commodity = arrival ? await db.commodities.get(arrival.commodityId) : null;
        
        recentDeals.push({
          _id: d._id,
          dealNumber: d.dealNumber,
          date: d.date,
          buyer: buyer?.name,
          commodity: commodity?.name,
          rate: d.rate
        });
      }

      // Bills
      const allJForms = await db.jforms.toArray();
      let unpaidJFormsCount = 0;
      let unpaidJFormsValue = 0;

      for (const jf of allJForms) {
        if (jf.status === 'UNPAID') {
          unpaidJFormsCount++;
          unpaidJFormsValue += jf.netAmount;
        }
      }

      return {
        metrics: {
          dailyArrivalsCount,
          dailyArrivalsWeight,
          dailyDealsCount,
          unpaidJFormsCount,
          unpaidJFormsValue
        },
        charts: { arrivalsByCommodity },
        recentDeals
      };
    }
  });
};
