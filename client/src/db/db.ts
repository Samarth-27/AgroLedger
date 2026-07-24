import Dexie, { Table } from 'dexie';
import {
  IFarmer, IBuyer, ICommodity, IGodown, IArrival, IDeal, IJForm, IBuyerInvoice,
  IPaymentReceipt, IBroker, ITransport, IVehicle, ILabour, IExpenseCategory,
  IAccountHead, IBank, IFinancialYear, ISystemSetting, ILedgerTransaction
} from '@mandi-erp/shared/src/schemas';

export class MandiDB extends Dexie {
  farmers!: Table<IFarmer, string>;
  buyers!: Table<IBuyer, string>;
  commodities!: Table<ICommodity, string>;
  godowns!: Table<IGodown, string>;
  arrivals!: Table<IArrival, string>;
  deals!: Table<IDeal, string>;
  jforms!: Table<IJForm, string>;
  invoices!: Table<IBuyerInvoice, string>;
  payments!: Table<IPaymentReceipt, string>;
  brokers!: Table<IBroker, string>;
  transports!: Table<ITransport, string>;
  vehicles!: Table<IVehicle, string>;
  labours!: Table<ILabour, string>;
  expenses!: Table<IExpenseCategory, string>;
  accountHeads!: Table<IAccountHead, string>;
  banks!: Table<IBank, string>;
  financialYears!: Table<IFinancialYear, string>;
  settings!: Table<ISystemSetting, string>;
  ledger!: Table<ILedgerTransaction, string>;

  constructor() {
    super('MandiDB');
    this.version(1).stores({
      farmers: '_id, name, mobile, code',
      buyers: '_id, name, mobile, gstNumber, panNumber, code',
      commodities: '_id, name, hsnCode',
      godowns: '_id, name',
      arrivals: '_id, arrivalNumber, farmerId, commodityId, date, status',
      deals: '_id, dealNumber, arrivalId, buyerId, date, status',
      jforms: '_id, jFormNumber, dealId, farmerId, date, status',
      invoices: '_id, invoiceNumber, buyerId, date, status',
      payments: '_id, voucherNumber, type, partyId, date, mode',
      brokers: '_id, name, mobile, code',
      transports: '_id, name, mobile',
      vehicles: '_id, vehicleNumber, transportId',
      labours: '_id, name, type',
      expenses: '_id, name',
      accountHeads: '_id, name, type',
      banks: '_id, name, accountNumber, ifsc',
      financialYears: '_id, name, startDate, endDate, isActive',
      settings: '_id, key',
      ledger: '_id, date, voucherType, voucherNumber, referenceId'
    });
  }
}

export const db = new MandiDB();
