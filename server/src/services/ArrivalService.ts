import { arrivalRepository } from '../repositories/ArrivalRepository';
import { ArrivalSchema } from '@mandi-erp/shared';
import { AppError } from '../utils/AppError';

export class ArrivalService {
  async createArrival(data: any) {
    const validated = ArrivalSchema.parse(data);
    return await arrivalRepository.create(validated);
  }

  async getArrivals() {
    const arrivals = await arrivalRepository.findWithDetails();
    return arrivals.map(this.mapArrivalToDTO);
  }

  async getArrivalById(id: string) {
    const arrival = await arrivalRepository.findByIdWithDetails(id);
    if (!arrival) throw new AppError('Arrival not found', 404);
    return this.mapArrivalToDTO(arrival);
  }

  async updateArrival(id: string, data: any) {
    // Cannot update if it's already auctioned, etc. (simplification for now)
    return await arrivalRepository.update(id, data);
  }

  async updateStatus(id: string, status: string) {
    return await arrivalRepository.update(id, { status });
  }

  async deleteArrival(id: string) {
    const arrival = await arrivalRepository.findById(id);
    if (arrival?.status !== 'PENDING') {
      throw new AppError('Only PENDING arrivals can be deleted', 400);
    }
    return await arrivalRepository.delete(id);
  }

  private mapArrivalToDTO(arrival: any) {
    return {
      _id: arrival._id,
      arrivalNumber: arrival.arrivalNumber,
      farmer: arrival.farmerId,
      commodity: arrival.commodityId,
      date: arrival.date,
      bags: arrival.bags,
      weight: arrival.weight,
      status: arrival.status,
      createdAt: arrival.createdAt,
    };
  }
}

export const arrivalService = new ArrivalService();
