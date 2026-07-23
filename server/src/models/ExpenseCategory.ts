import mongoose, { Schema, Document } from 'mongoose';
import { IExpenseCategory } from '@mandi-erp/shared';

export interface IExpenseCategoryDocument extends Omit<IExpenseCategory, '_id'>, Document {}

const ExpenseCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const ExpenseCategory = mongoose.model<IExpenseCategoryDocument>('ExpenseCategory', ExpenseCategorySchema);
