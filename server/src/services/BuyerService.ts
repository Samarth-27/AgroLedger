import { buyerRepository } from '@repositories/BuyerRepository';
import { IBuyer, BuyerSchema } from '@mandi-erp/shared';
import { AppError } from '@utils/AppError';

export class BuyerService {
  async createBuyer(data: unknown) {
    const parsedData = BuyerSchema.parse(data);
    
    // Check for duplicate GST if provided
    if (parsedData.gstNumber) {
      const existing = await buyerRepository.findOne({ gstNumber: parsedData.gstNumber });
      if (existing) throw new AppError('Buyer with this GST Number already exists', 400);
    }
    
    return await buyerRepository.create(parsedData);
  }

  async getBuyers() {
    return await buyerRepository.find();
  }

  async getBuyerById(id: string) {
    const buyer = await buyerRepository.findById(id);
    if (!buyer) throw new AppError('Buyer not found', 404);
    return buyer;
  }

  async updateBuyer(id: string, data: Partial<IBuyer>) {
    const buyer = await buyerRepository.update(id, data);
    if (!buyer) throw new AppError('Buyer not found', 404);
    return buyer;
  }

  async deleteBuyer(id: string) {
    const deleted = await buyerRepository.delete(id);
    if (!deleted) throw new AppError('Buyer not found', 404);
    return true;
  }
}

export const buyerService = new BuyerService();
