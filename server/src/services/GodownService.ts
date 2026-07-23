import { godownRepository } from '@repositories/GodownRepository';
import { IGodown, GodownSchema } from '@mandi-erp/shared';
import { AppError } from '@utils/AppError';

export class GodownService {
  async createGodown(data: unknown) {
    const parsedData = GodownSchema.parse(data);
    return await godownRepository.create(parsedData);
  }

  async getGodowns() {
    return await godownRepository.find();
  }

  async getGodownById(id: string) {
    const godown = await godownRepository.findById(id);
    if (!godown) throw new AppError('Godown not found', 404);
    return godown;
  }

  async updateGodown(id: string, data: Partial<IGodown>) {
    const godown = await godownRepository.update(id, data);
    if (!godown) throw new AppError('Godown not found', 404);
    return godown;
  }

  async deleteGodown(id: string) {
    const deleted = await godownRepository.delete(id);
    if (!deleted) throw new AppError('Godown not found', 404);
    return true;
  }
}

export const godownService = new GodownService();
