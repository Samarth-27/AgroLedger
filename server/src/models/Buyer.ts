import mongoose, { Schema, Document } from 'mongoose';
import { IBuyer } from '@mandi-erp/shared';

export interface IBuyerDocument extends Omit<IBuyer, '_id'>, Document {
  code: string;
}

const BuyerSchema = new Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true },
    mobile: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },
    address: { type: String, required: true },
    commissionRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BuyerSchema.pre('save', async function (next) {
  if (this.isNew && !this.code) {
    const count = await mongoose.model('Buyer').countDocuments();
    this.code = `B-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const Buyer = mongoose.model<IBuyerDocument>('Buyer', BuyerSchema);
