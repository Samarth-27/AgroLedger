import { BaseRepository } from './BaseRepository';
import { JForm, IJFormDocument } from '../models/JForm';

export class JFormRepository extends BaseRepository<IJFormDocument> {
  constructor() {
    super(JForm);
  }

  async findWithDetails(): Promise<IJFormDocument[]> {
    return await this.model.find()
      .populate('farmerId')
      .populate({
        path: 'dealId',
        populate: {
          path: 'arrivalId',
          populate: { path: 'commodityId' }
        }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByIdWithDetails(id: string): Promise<IJFormDocument | null> {
    return await this.model.findById(id)
      .populate('farmerId')
      .populate({
        path: 'dealId',
        populate: {
          path: 'arrivalId',
          populate: { path: 'commodityId' }
        }
      })
      .exec();
  }
}

export const jFormRepository = new JFormRepository();
