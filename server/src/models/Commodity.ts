import mongoose, { Schema, Document } from 'mongoose';
import { ICommodity } from '@mandi-erp/shared';

export interface ICommodityDocument extends Omit<ICommodity, '_id'>, Document {}

const CommoditySchema = new Schema(
  {
    name: { type: String, required: true },
    hindiName: { type: String },
    hsnCode: { type: String },
    mandiTaxRate: { type: Number, default: 0 },
    kkfRate: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Commodity = mongoose.model<ICommodityDocument>('Commodity', CommoditySchema);
