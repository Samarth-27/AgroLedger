import mongoose, { Schema, Document } from 'mongoose';
import { IBroker } from '@mandi-erp/shared';

export interface IBrokerDocument extends Omit<IBroker, '_id'>, Document {
  code: string;
}

const BrokerSchema = new Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true },
    mobile: { type: String },
    brokerageRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate Code
BrokerSchema.pre('save', async function (next) {
  if (this.isNew && !this.code) {
    const count = await mongoose.model('Broker').countDocuments();
    this.code = `BRK-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const Broker = mongoose.model<IBrokerDocument>('Broker', BrokerSchema);
