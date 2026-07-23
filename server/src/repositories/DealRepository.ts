import { BaseRepository } from './BaseRepository';
import { Deal, IDealDocument } from '../models/Deal';

export class DealRepository extends BaseRepository<IDealDocument> {
  constructor() {
    super(Deal);
  }

  async findWithDetails(): Promise<IDealDocument[]> {
    return await this.model.find()
      .populate({
        path: 'arrivalId',
        populate: { path: 'farmerId commodityId' }
      })
      .populate('buyerId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByIdWithDetails(id: string): Promise<IDealDocument | null> {
    return await this.model.findById(id)
      .populate({
        path: 'arrivalId',
        populate: { path: 'farmerId commodityId' }
      })
      .populate('buyerId')
      .exec();
  }
}

export const dealRepository = new DealRepository();
