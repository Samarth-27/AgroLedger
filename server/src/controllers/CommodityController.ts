import { Request, Response, NextFunction } from 'express';
import { commodityService } from '@services/CommodityService';

export class CommodityController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commodityService.createCommodity(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commodityService.getCommodities();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commodityService.getCommodityById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await commodityService.updateCommodity(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await commodityService.deleteCommodity(req.params.id);
      res.json({ success: true, message: 'Commodity deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const commodityController = new CommodityController();
