import { Request, Response, NextFunction } from 'express';
import { buyerInvoiceService } from '../services/BuyerInvoiceService';

export class BuyerInvoiceController {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { buyerId, dealIds } = req.body;
      const result = await buyerInvoiceService.generateInvoice(buyerId, dealIds);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerInvoiceService.getAllInvoices();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await buyerInvoiceService.getInvoiceById(req.params.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const buyerInvoiceController = new BuyerInvoiceController();
