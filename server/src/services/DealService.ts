import { dealRepository } from '../repositories/DealRepository';
import { arrivalService } from './ArrivalService';
import { DealSchema } from '@mandi-erp/shared';
import { AppError } from '../utils/AppError';

export class DealService {
  async createDeal(data: any) {
    const validated = DealSchema.parse(data);
    
    // Check arrival status
    const arrival = await arrivalService.getArrivalById(validated.arrivalId);
    if (arrival.status !== 'PENDING') {
      throw new AppError('Deal can only be created for PENDING arrivals', 400);
    }

    // Create deal
    const deal = await dealRepository.create(validated);

    // Update arrival status to AUCTIONED
    await arrivalService.updateStatus(validated.arrivalId, 'AUCTIONED');

    return deal;
  }

  async getDeals() {
    const deals = await dealRepository.findWithDetails();
    return deals.map(this.mapDealToDTO);
  }

  async getDealById(id: string) {
    const deal = await dealRepository.findByIdWithDetails(id);
    if (!deal) throw new AppError('Deal not found', 404);
    return this.mapDealToDTO(deal);
  }

  async deleteDeal(id: string) {
    const deal = await dealRepository.findById(id);
    if (!deal) throw new AppError('Deal not found', 404);
    
    // Revert arrival status back to PENDING
    await arrivalService.updateStatus(deal.arrivalId as string, 'PENDING');
    
    return await dealRepository.delete(id);
  }

  async updateStatus(id: string, status: string) {
    return await dealRepository.update(id, { status });
  }

  private mapDealToDTO(deal: any) {
    return {
      _id: deal._id,
      dealNumber: deal.dealNumber,
      arrival: {
        _id: deal.arrivalId._id,
        arrivalNumber: deal.arrivalId.arrivalNumber,
        farmer: deal.arrivalId.farmerId,
        commodity: deal.arrivalId.commodityId,
        weight: deal.arrivalId.weight,
        bags: deal.arrivalId.bags
      },
      buyer: deal.buyerId,
      rate: deal.rate,
      date: deal.date,
      status: deal.status,
      createdAt: deal.createdAt,
    };
  }
}

export const dealService = new DealService();
