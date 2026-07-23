import mongoose, { Schema, Document } from 'mongoose';
import { ILabour } from '@mandi-erp/shared';

export interface ILabourDocument extends Omit<ILabour, '_id'>, Document {}

const LabourSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['PALLEDAR', 'HAMAL', 'TULAI'], required: true },
    rate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Labour = mongoose.model<ILabourDocument>('Labour', LabourSchema);
