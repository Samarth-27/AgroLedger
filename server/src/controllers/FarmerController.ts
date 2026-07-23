import { Request, Response, NextFunction } from 'express';
import { farmerService } from '@services/FarmerService';

export class FarmerController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await farmerService.createFarmer(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await farmerService.getFarmers();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await farmerService.getFarmerById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await farmerService.updateFarmer(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await farmerService.deleteFarmer(req.params.id);
      res.json({ success: true, message: 'Farmer deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const farmerController = new FarmerController();
