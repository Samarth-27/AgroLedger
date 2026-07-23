import mongoose, { Schema, Document } from 'mongoose';
import { IAccountHead } from '@mandi-erp/shared';

export interface IAccountHeadDocument extends Omit<IAccountHead, '_id'>, Document {}

const AccountHeadSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'], required: true },
  },
  { timestamps: true }
);

export const AccountHead = mongoose.model<IAccountHeadDocument>('AccountHead', AccountHeadSchema);
