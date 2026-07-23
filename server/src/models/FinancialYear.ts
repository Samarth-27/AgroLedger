import mongoose, { Schema, Document } from 'mongoose';
import { IFinancialYear } from '@mandi-erp/shared';

export interface IFinancialYearDocument extends Omit<IFinancialYear, '_id'>, Document {}

const FinancialYearSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FinancialYear = mongoose.model<IFinancialYearDocument>('FinancialYear', FinancialYearSchema);
