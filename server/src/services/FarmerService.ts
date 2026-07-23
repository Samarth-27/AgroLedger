import { farmerRepository } from '@repositories/FarmerRepository';
import { IFarmer, FarmerSchema } from '@mandi-erp/shared';
import { AppError } from '@utils/AppError';

export class FarmerService {
  async createFarmer(data: unknown) {
    const parsedData = FarmerSchema.parse(data);
    return await farmerRepository.create(parsedData);
  }

  async getFarmers() {
    return await farmerRepository.find();
  }

  async getFarmerById(id: string) {
    const farmer = await farmerRepository.findById(id);
    if (!farmer) throw new AppError('Farmer not found', 404);
    return farmer;
  }

  async updateFarmer(id: string, data: Partial<IFarmer>) {
    const farmer = await farmerRepository.update(id, data);
    if (!farmer) throw new AppError('Farmer not found', 404);
    return farmer;
  }

  async deleteFarmer(id: string) {
    const deleted = await farmerRepository.delete(id);
    if (!deleted) throw new AppError('Farmer not found', 404);
    return true;
  }
}

export const farmerService = new FarmerService();
