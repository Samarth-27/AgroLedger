import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '@services/DashboardService';

export class DashboardController {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashboardService.getSummary();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
