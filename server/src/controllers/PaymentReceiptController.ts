import { Request, Response, NextFunction } from 'express';
import { paymentReceiptService } from '../services/PaymentReceiptService';

export class PaymentReceiptController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentReceiptService.createRecord(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentReceiptService.getAll();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentReceiptService.getById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getByParty(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentReceiptService.getByParty(req.params.partyId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const paymentReceiptController = new PaymentReceiptController();
