import { Request, Response, NextFunction } from 'express';
import { godownService } from '@services/GodownService';

export class GodownController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await godownService.createGodown(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await godownService.getGodowns();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await godownService.getGodownById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await godownService.updateGodown(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await godownService.deleteGodown(req.params.id);
      res.json({ success: true, message: 'Godown deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export const godownController = new GodownController();
