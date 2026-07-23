import mongoose, { Schema, Document } from 'mongoose';
import { ILedgerTransaction, ILedgerTransactionLine } from '@mandi-erp/shared';

export interface ILedgerTransactionDocument extends Omit<ILedgerTransaction, '_id'>, Document {}

const LedgerTransactionLineSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: 'AccountHead' },
    accountName: { type: String, required: true },
    partyId: { type: Schema.Types.ObjectId, refPath: 'lines.partyModel' },
    partyModel: { type: String, enum: ['Buyer', 'Farmer'] },
    debit: { type: Schema.Types.Decimal128, default: 0 },
    credit: { type: Schema.Types.Decimal128, default: 0 },
  },
  { _id: false }
);

const LedgerTransactionSchema = new Schema(
  {
    date: { type: Date, required: true },
    voucherType: { 
      type: String, 
      enum: ['J-FORM', 'INVOICE', 'PAYMENT', 'RECEIPT', 'JOURNAL', 'CONTRA'], 
      required: true 
    },
    voucherNumber: { type: String, required: true },
    referenceId: { type: Schema.Types.ObjectId },
    narration: { type: String },
    lines: [LedgerTransactionLineSchema],
    financialYearId: { type: Schema.Types.ObjectId, ref: 'FinancialYear' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add index on referenceId to easily fetch transaction linked to JForm or Invoice
LedgerTransactionSchema.index({ referenceId: 1 });
LedgerTransactionSchema.index({ date: 1 });
LedgerTransactionSchema.index({ 'lines.accountId': 1 });
LedgerTransactionSchema.index({ 'lines.partyId': 1 });

export const LedgerTransaction = mongoose.model<ILedgerTransactionDocument>('LedgerTransaction', LedgerTransactionSchema);
