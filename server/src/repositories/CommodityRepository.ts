import { BaseRepository } from './BaseRepository';
import { Commodity, ICommodityDocument } from '@models/Commodity';

export class CommodityRepository extends BaseRepository<ICommodityDocument> {
  constructor() {
    super(Commodity);
  }
}

export const commodityRepository = new CommodityRepository();
