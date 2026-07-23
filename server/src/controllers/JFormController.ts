import { Request, Response, NextFunction } from 'express';
import { jFormService } from '@services/JFormService';

export class JFormController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await jFormService.generateJForm(req.body.dealId);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await jFormService.getJForms();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await jFormService.getJFormById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const jFormController = new JFormController();
