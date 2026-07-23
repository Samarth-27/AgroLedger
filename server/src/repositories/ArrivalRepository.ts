import { BaseRepository } from './BaseRepository';
import { Arrival, IArrivalDocument } from '../models/Arrival';

export class ArrivalRepository extends BaseRepository<IArrivalDocument> {
  constructor() {
    super(Arrival);
  }

  async findWithDetails(): Promise<IArrivalDocument[]> {
    return await this.model.find().populate('farmerId').populate('commodityId').sort({ createdAt: -1 }).exec();
  }

  async findByIdWithDetails(id: string): Promise<IArrivalDocument | null> {
    return await this.model.findById(id).populate('farmerId').populate('commodityId').exec();
  }
}

export const arrivalRepository = new ArrivalRepository();
