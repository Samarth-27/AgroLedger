import { Router } from 'express';
import { arrivalController } from '@controllers/ArrivalController';
import { dealController } from '@controllers/DealController';

const router = Router();

// Arrival Routes
router.post('/arrivals', arrivalController.create.bind(arrivalController));
router.get('/arrivals', arrivalController.getAll.bind(arrivalController));
router.get('/arrivals/:id', arrivalController.getById.bind(arrivalController));
router.put('/arrivals/:id', arrivalController.update.bind(arrivalController));
router.delete('/arrivals/:id', arrivalController.delete.bind(arrivalController));

// Deal Routes
router.post('/deals', dealController.create.bind(dealController));
router.get('/deals', dealController.getAll.bind(dealController));
router.get('/deals/:id', dealController.getById.bind(dealController));
router.delete('/deals/:id', dealController.delete.bind(dealController));

export { router as transactionRoutes };
