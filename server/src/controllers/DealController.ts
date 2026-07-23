import { Request, Response, NextFunction } from 'express';
import { dealService } from '@services/DealService';

export class DealController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dealService.createDeal(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dealService.getDeals();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dealService.getDealById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await dealService.deleteDeal(req.params.id);
      res.json({ success: true, message: 'Deal deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const dealController = new DealController();
