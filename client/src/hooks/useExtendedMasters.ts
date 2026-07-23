import { createMasterHooks } from './useGenericMaster';
import {
  IBroker, ITransport, IVehicle, ILabour,
  IExpenseCategory, IAccountHead, IBank,
  IFinancialYear, ISystemSetting
} from '@mandi-erp/shared';

export const brokerHooks = createMasterHooks<IBroker>('/masters/brokers', 'brokers');
export const transportHooks = createMasterHooks<ITransport>('/masters/transports', 'transports');
export const vehicleHooks = createMasterHooks<IVehicle>('/masters/vehicles', 'vehicles');
export const labourHooks = createMasterHooks<ILabour>('/masters/labours', 'labours');
export const expenseCategoryHooks = createMasterHooks<IExpenseCategory>('/masters/expense-categories', 'expenseCategories');
export const accountHeadHooks = createMasterHooks<IAccountHead>('/masters/account-heads', 'accountHeads');
export const bankHooks = createMasterHooks<IBank>('/masters/banks', 'banks');
export const financialYearHooks = createMasterHooks<IFinancialYear>('/masters/financial-years', 'financialYears');
export const systemSettingHooks = createMasterHooks<ISystemSetting>('/masters/settings', 'settings');
