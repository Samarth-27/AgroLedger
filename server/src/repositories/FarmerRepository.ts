import { BaseRepository } from './BaseRepository';
import { Farmer, IFarmerDocument } from '@models/Farmer';

export class FarmerRepository extends BaseRepository<IFarmerDocument> {
  constructor() {
    super(Farmer);
  }
}

export const farmerRepository = new FarmerRepository();
