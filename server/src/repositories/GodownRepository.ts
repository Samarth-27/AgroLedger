import { BaseRepository } from './BaseRepository';
import { Godown, IGodownDocument } from '@models/Godown';

export class GodownRepository extends BaseRepository<IGodownDocument> {
  constructor() {
    super(Godown);
  }
}

export const godownRepository = new GodownRepository();
