import { Request, Response, NextFunction } from 'express';
import { buyerService } from '@services/BuyerService';

export class BuyerController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerService.createBuyer(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerService.getBuyers();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerService.getBuyerById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerService.updateBuyer(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await buyerService.deleteBuyer(req.params.id);
      res.json({ success: true, message: 'Buyer deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const buyerController = new BuyerController();
