import { Request, Response, NextFunction } from 'express';
import { ledgerService } from '../services/LedgerService';

export class LedgerController {
  async getTrialBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const trialBalance = await ledgerService.getTrialBalance();
      res.json({ success: true, data: trialBalance, message: 'Trial balance retrieved successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAccountLedger(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, partyId } = req.query;
      const transactions = await ledgerService.getAccountLedger(
        accountId as string,
        partyId as string
      );
      res.json({ success: true, data: transactions, message: 'Ledger transactions retrieved successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const ledgerController = new LedgerController();
