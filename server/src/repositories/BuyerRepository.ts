import { BaseRepository } from './BaseRepository';
import { Buyer, IBuyerDocument } from '@models/Buyer';

export class BuyerRepository extends BaseRepository<IBuyerDocument> {
  constructor() {
    super(Buyer);
  }
}

export const buyerRepository = new BuyerRepository();
