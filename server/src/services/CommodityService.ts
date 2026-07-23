import { commodityRepository } from '@repositories/CommodityRepository';
import { ICommodity, CommoditySchema } from '@mandi-erp/shared';
import { AppError } from '@utils/AppError';

export class CommodityService {
  async createCommodity(data: unknown) {
    const parsedData = CommoditySchema.parse(data);
    return await commodityRepository.create(parsedData);
  }

  async getCommodities() {
    return await commodityRepository.find();
  }

  async getCommodityById(id: string) {
    const commodity = await commodityRepository.findById(id);
    if (!commodity) throw new AppError('Commodity not found', 404);
    return commodity;
  }

  async updateCommodity(id: string, data: Partial<ICommodity>) {
    const commodity = await commodityRepository.update(id, data);
    if (!commodity) throw new AppError('Commodity not found', 404);
    return commodity;
  }

  async deleteCommodity(id: string) {
    const deleted = await commodityRepository.delete(id);
    if (!deleted) throw new AppError('Commodity not found', 404);
    return true;
  }
}

export const commodityService = new CommodityService();
