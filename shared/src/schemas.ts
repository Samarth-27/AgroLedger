import { z } from 'zod';

export const FarmerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  fatherName: z.string().min(2, "Father Name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
  village: z.string().min(2, "Village is required"),
  bankDetails: z.object({
    accountNo: z.string().optional(),
    ifsc: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),
});

export const BuyerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number").optional().or(z.literal('')),
  gstNumber: z.string().regex(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}Z[0-9a-zA-Z]{1}$/i, "Invalid GST Number (e.g. 07AAAAA0000A1Z5)").optional().or(z.literal('')),
  panNumber: z.string().regex(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/i, "Invalid PAN Number (e.g. ABCDE1234F)").optional().or(z.literal('')),
  address: z.string().min(5, "Address is required"),
  commissionRate: z.coerce.number().min(0, "Rate cannot be negative").default(0),
});

export const CommoditySchema = z.object({
  name: z.string().min(2, "Name is required"),
  hindiName: z.string().optional(),
  hsnCode: z.string().optional(),
  mandiTaxRate: z.coerce.number().min(0).default(0),
  kkfRate: z.coerce.number().min(0).default(0),
  cgst: z.coerce.number().min(0).default(0),
  sgst: z.coerce.number().min(0).default(0),
});

export const GodownSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().optional(),
  capacity: z.coerce.number().min(0).default(0),
});

export const ArrivalSchema = z.object({
  farmerId: z.string().min(1, "Farmer is required"),
  commodityId: z.string().min(1, "Commodity is required"),
  date: z.string().or(z.date()),
  bags: z.number().min(1, "Must have at least 1 bag"),
  weight: z.number().min(0.01, "Weight must be greater than 0"),
  status: z.enum(['PENDING', 'AUCTIONED', 'BILLED']).default('PENDING'),
});

export const DealSchema = z.object({
  arrivalId: z.string().min(1, "Arrival is required"),
  buyerId: z.string().min(1, "Buyer is required"),
  date: z.string().or(z.date()),
  rate: z.number().min(0.01, "Rate must be greater than 0"),
  status: z.enum(['CONFIRMED', 'BILLED', 'CANCELLED']).default('CONFIRMED'),
});

export const JFormSchema = z.object({
  dealId: z.string().min(1, "Deal is required"),
  farmerId: z.string().min(1, "Farmer is required"),
  date: z.string().or(z.date()),
  grossAmount: z.number().min(0),
  commissionExpense: z.number().min(0).default(0),
  palledari: z.number().min(0).default(0),
  hamali: z.number().min(0).default(0),
  tulai: z.number().min(0).default(0),
  kkf: z.number().min(0).default(0),
  mandiTax: z.number().min(0).default(0),
  labourExpense: z.number().min(0).default(0), // Keeping for backward compatibility if needed
  netAmount: z.number().min(0),
  status: z.enum(['UNPAID', 'PARTIAL', 'PAID']).default('UNPAID'),
});

export const BuyerInvoiceSchema = z.object({
  buyerId: z.string().min(1, "Buyer is required"),
  dealIds: z.array(z.string()).min(1, "At least one deal is required"),
  date: z.string().or(z.date()),
  grossAmount: z.number().min(0),
  commissionAmount: z.number().min(0).default(0),
  mandiTaxAmount: z.number().min(0).default(0),
  cgstAmount: z.number().min(0).default(0),
  sgstAmount: z.number().min(0).default(0),
  igstAmount: z.number().min(0).default(0),
  netAmount: z.number().min(0),
  status: z.enum(['UNPAID', 'PARTIAL', 'PAID']).default('UNPAID'),
});

export const PaymentReceiptSchema = z.object({
  type: z.enum(['PAYMENT', 'RECEIPT']), // PAYMENT to Farmer, RECEIPT from Buyer
  partyId: z.string().min(1, "Party (Farmer/Buyer) is required"),
  date: z.string().or(z.date()),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  mode: z.enum(['CASH', 'BANK', 'CHEQUE', 'UPI']),
  reference: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const BrokerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number").optional().or(z.literal('')),
  brokerageRate: z.coerce.number().min(0).default(0),
});

export const TransportSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number").optional().or(z.literal('')),
});

export const VehicleSchema = z.object({
  vehicleNumber: z.string().min(2, "Vehicle Number is required"),
  transportId: z.string().optional(),
});

export const LabourSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(['PALLEDAR', 'HAMAL', 'TULAI']),
  rate: z.coerce.number().min(0).default(0),
});

export const ExpenseCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

export const AccountHeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']),
});

export const LedgerTransactionLineSchema = z.object({
  accountId: z.any().optional(), // ObjectId
  accountName: z.string(),
  partyId: z.any().optional(), // ObjectId (Buyer or Farmer)
  partyModel: z.enum(['Buyer', 'Farmer']).optional(),
  debit: z.number().default(0),
  credit: z.number().default(0),
});

export const LedgerTransactionSchema = z.object({
  date: z.date(),
  voucherType: z.enum(['J-FORM', 'INVOICE', 'PAYMENT', 'RECEIPT', 'JOURNAL', 'CONTRA']),
  voucherNumber: z.string(),
  referenceId: z.any().optional(), // ObjectId
  narration: z.string().optional(),
  lines: z.array(LedgerTransactionLineSchema).min(2, "At least two lines required for double-entry"),
  financialYearId: z.any().optional(), // ObjectId
  isDeleted: z.boolean().default(false),
});

export const BankSchema = z.object({
  name: z.string().min(2, "Bank Name is required"),
  accountNumber: z.string().min(2, "Account Number is required"),
  ifsc: z.string().min(2, "IFSC is required"),
  branch: z.string().optional(),
});

export const FinancialYearSchema = z.object({
  name: z.string().min(2, "Name is required"), // e.g., "2026-2027"
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().default(false),
});

export const SystemSettingSchema = z.object({
  key: z.string().min(2, "Setting Key is required"),
  value: z.any(),
  description: z.string().optional(),
});

export type IFarmer = z.infer<typeof FarmerSchema> & { _id?: any, code?: string };
export type IBuyer = z.infer<typeof BuyerSchema> & { _id?: any, code?: string };
export type ICommodity = z.infer<typeof CommoditySchema> & { _id?: any };
export type IGodown = z.infer<typeof GodownSchema> & { _id?: any };
export type IArrival = z.infer<typeof ArrivalSchema> & { _id?: any, arrivalNumber?: string, farmer?: IFarmer, commodity?: ICommodity };
export type IDeal = z.infer<typeof DealSchema> & { _id?: any, dealNumber?: string, arrival?: IArrival, buyer?: IBuyer };
export type IJForm = z.infer<typeof JFormSchema> & { _id?: any, jFormNumber?: string, deal?: IDeal, farmer?: IFarmer };
export type IBuyerInvoice = z.infer<typeof BuyerInvoiceSchema> & { _id?: any, invoiceNumber?: string, buyer?: IBuyer, deals?: IDeal[] };
export type IPaymentReceipt = z.infer<typeof PaymentReceiptSchema> & { _id?: any, voucherNumber?: string };
export type ILoginRequest = z.infer<typeof LoginSchema>;

export type IBroker = z.infer<typeof BrokerSchema> & { _id?: any, code?: string };
export type ITransport = z.infer<typeof TransportSchema> & { _id?: any };
export type IVehicle = z.infer<typeof VehicleSchema> & { _id?: any, transport?: ITransport };
export type ILabour = z.infer<typeof LabourSchema> & { _id?: any };
export type IExpenseCategory = z.infer<typeof ExpenseCategorySchema> & { _id?: any };
export type IAccountHead = z.infer<typeof AccountHeadSchema> & { _id?: any };
export type IBank = z.infer<typeof BankSchema> & { _id?: any };
export type IFinancialYear = z.infer<typeof FinancialYearSchema> & { _id?: any };
export type ISystemSetting = z.infer<typeof SystemSettingSchema> & { _id?: any };
export type ILedgerTransactionLine = z.infer<typeof LedgerTransactionLineSchema>;
export type ILedgerTransaction = z.infer<typeof LedgerTransactionSchema> & { _id?: any };
