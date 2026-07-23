import { Router } from 'express';
import { farmerController } from '@controllers/FarmerController';
import { buyerController } from '@controllers/BuyerController';
import { commodityController } from '@controllers/CommodityController';
import { godownController } from '@controllers/GodownController';
import { createGenericRouter } from './genericRoutes';
import { Broker } from '../models/Broker';
import { Transport } from '../models/Transport';
import { Vehicle } from '../models/Vehicle';
import { Labour } from '../models/Labour';
import { ExpenseCategory } from '../models/ExpenseCategory';
import { AccountHead } from '../models/AccountHead';
import { Bank } from '../models/Bank';
import { FinancialYear } from '../models/FinancialYear';
import { SystemSetting } from '../models/SystemSetting';
import {
  BrokerSchema, TransportSchema, VehicleSchema, LabourSchema,
  ExpenseCategorySchema, AccountHeadSchema, BankSchema,
  FinancialYearSchema, SystemSettingSchema
} from '@mandi-erp/shared';

const router = Router();

// Farmer Routes
router.post('/farmers', farmerController.create.bind(farmerController));
router.get('/farmers', farmerController.getAll.bind(farmerController));
router.get('/farmers/:id', farmerController.getById.bind(farmerController));
router.put('/farmers/:id', farmerController.update.bind(farmerController));
router.delete('/farmers/:id', farmerController.delete.bind(farmerController));

// Buyer Routes
router.post('/buyers', buyerController.create.bind(buyerController));
router.get('/buyers', buyerController.getAll.bind(buyerController));
router.get('/buyers/:id', buyerController.getById.bind(buyerController));
router.put('/buyers/:id', buyerController.update.bind(buyerController));
router.delete('/buyers/:id', buyerController.delete.bind(buyerController));

// Commodity Routes
router.post('/commodities', commodityController.create.bind(commodityController));
router.get('/commodities', commodityController.getAll.bind(commodityController));
router.get('/commodities/:id', commodityController.getById.bind(commodityController));
router.put('/commodities/:id', commodityController.update.bind(commodityController));
router.delete('/commodities/:id', commodityController.delete.bind(commodityController));

// Godown Routes
router.post('/godowns', godownController.create.bind(godownController));
router.get('/godowns', godownController.getAll.bind(godownController));
router.get('/godowns/:id', godownController.getById.bind(godownController));
router.put('/godowns/:id', godownController.update.bind(godownController));
router.delete('/godowns/:id', godownController.delete.bind(godownController));

// Extended Masters (Generic Routes)
router.use('/brokers', createGenericRouter(Broker, BrokerSchema, 'Broker'));
router.use('/transports', createGenericRouter(Transport, TransportSchema, 'Transport'));
router.use('/vehicles', createGenericRouter(Vehicle, VehicleSchema, 'Vehicle'));
router.use('/labours', createGenericRouter(Labour, LabourSchema, 'Labour'));
router.use('/expense-categories', createGenericRouter(ExpenseCategory, ExpenseCategorySchema, 'ExpenseCategory'));
router.use('/account-heads', createGenericRouter(AccountHead, AccountHeadSchema, 'AccountHead'));
router.use('/banks', createGenericRouter(Bank, BankSchema, 'Bank'));
router.use('/financial-years', createGenericRouter(FinancialYear, FinancialYearSchema, 'FinancialYear'));
router.use('/settings', createGenericRouter(SystemSetting, SystemSettingSchema, 'SystemSetting'));

export { router as masterRoutes };
