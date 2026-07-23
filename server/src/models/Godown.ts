import mongoose, { Schema, Document } from 'mongoose';
import { IGodown } from '@mandi-erp/shared';

export interface IGodownDocument extends Omit<IGodown, '_id'>, Document {}

const GodownSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    capacity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Godown = mongoose.model<IGodownDocument>('Godown', GodownSchema);
