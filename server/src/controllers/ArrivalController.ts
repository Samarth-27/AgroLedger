import { Request, Response, NextFunction } from 'express';
import { arrivalService } from '@services/ArrivalService';

export class ArrivalController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await arrivalService.createArrival(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await arrivalService.getArrivals();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await arrivalService.getArrivalById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await arrivalService.updateArrival(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await arrivalService.deleteArrival(req.params.id);
      res.json({ success: true, message: 'Arrival deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const arrivalController = new ArrivalController();
