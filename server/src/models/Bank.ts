import mongoose, { Schema, Document } from 'mongoose';
import { IBank } from '@mandi-erp/shared';

export interface IBankDocument extends Omit<IBank, '_id'>, Document {}

const BankSchema = new Schema(
  {
    name: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    ifsc: { type: String, required: true },
    branch: { type: String },
  },
  { timestamps: true }
);

export const Bank = mongoose.model<IBankDocument>('Bank', BankSchema);
