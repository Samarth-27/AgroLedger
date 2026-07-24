import { createMasterHooks } from './useGenericMaster';
import {
  IBroker, ITransport, IVehicle, ILabour,
  IExpenseCategory, IAccountHead, IBank,
  IFinancialYear, ISystemSetting
} from '@mandi-erp/shared';

export const brokerHooks = createMasterHooks<IBroker>('brokers', 'brokers');
export const transportHooks = createMasterHooks<ITransport>('transports', 'transports');
export const vehicleHooks = createMasterHooks<IVehicle>('vehicles', 'vehicles');
export const labourHooks = createMasterHooks<ILabour>('labours', 'labours');
export const expenseCategoryHooks = createMasterHooks<IExpenseCategory>('expenses', 'expenseCategories');
export const accountHeadHooks = createMasterHooks<IAccountHead>('accountHeads', 'accountHeads');
export const bankHooks = createMasterHooks<IBank>('banks', 'banks');
export const financialYearHooks = createMasterHooks<IFinancialYear>('financialYears', 'financialYears');
export const systemSettingHooks = createMasterHooks<ISystemSetting>('settings', 'settings');
