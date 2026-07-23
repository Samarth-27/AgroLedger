import { Arrival } from '../models/Arrival';
import { Deal } from '../models/Deal';
import { JForm } from '../models/JForm';
import { Commodity } from '../models/Commodity';

export class DashboardService {
  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Daily Arrivals (weight)
    const dailyArrivals = await Arrival.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, totalWeight: { $sum: "$weight" }, count: { $sum: 1 } } }
    ]);

    // 2. Total Daily Deals (value)
    const dailyDeals = await Deal.aggregate([
      { $match: { createdAt: { $gte: today } } },
      // Note: Value is actually calculated as rate * arrival.weight, but we don't have arrival weight directly here without lookup
      // So we'll just count them for the summary card
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    // 3. Total Unpaid J-Forms
    const unpaidJForms = await JForm.aggregate([
      { $match: { status: 'UNPAID' } },
      { $group: { _id: null, count: { $sum: 1 }, totalValue: { $sum: "$netAmount" } } }
    ]);

    // 4. Arrivals by Commodity (for pie chart)
    const arrivalsByCommodity = await Arrival.aggregate([
      {
        $lookup: {
          from: "commodities",
          localField: "commodityId",
          foreignField: "_id",
          as: "commodity"
        }
      },
      { $unwind: "$commodity" },
      {
        $group: {
          _id: "$commodity.name",
          totalWeight: { $sum: "$weight" }
        }
      },
      {
        $project: {
          name: "$_id",
          value: "$totalWeight",
          _id: 0
        }
      }
    ]);

    // 5. Recent Deals (for timeline)
    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .populate('buyerId', 'name')
      .populate({
        path: 'arrivalId',
        populate: { path: 'commodityId', select: 'name' }
      });

    const formattedRecentDeals = recentDeals.map(d => ({
      _id: d._id,
      dealNumber: d.dealNumber,
      buyer: (d.buyerId as any)?.name,
      commodity: (d.arrivalId as any)?.commodityId?.name,
      rate: d.rate,
      date: (d as any).createdAt || d.date
    }));

    return {
      metrics: {
        dailyArrivalsCount: dailyArrivals[0]?.count || 0,
        dailyArrivalsWeight: dailyArrivals[0]?.totalWeight || 0,
        dailyDealsCount: dailyDeals[0]?.count || 0,
        unpaidJFormsCount: unpaidJForms[0]?.count || 0,
        unpaidJFormsValue: unpaidJForms[0]?.totalValue || 0,
      },
      charts: {
        arrivalsByCommodity
      },
      recentDeals: formattedRecentDeals
    };
  }
}

export const dashboardService = new DashboardService();
