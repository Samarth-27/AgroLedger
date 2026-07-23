import { Router } from 'express';
import { ledgerController } from '../controllers/LedgerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/trial-balance', ledgerController.getTrialBalance);
router.get('/transactions', ledgerController.getAccountLedger);

export const ledgerRoutes = router;
