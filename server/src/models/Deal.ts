import mongoose, { Schema, Document } from 'mongoose';
import { IDeal } from '@mandi-erp/shared';

export interface IDealDocument extends Omit<IDeal, '_id' | 'arrival' | 'buyer' | 'arrivalId' | 'buyerId'>, Document {
  arrivalId: mongoose.Types.ObjectId | string;
  buyerId: mongoose.Types.ObjectId | string;
}

const DealSchema = new Schema(
  {
    dealNumber: { type: String, unique: true },
    arrivalId: { type: Schema.Types.ObjectId, ref: 'Arrival', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    date: { type: Date, required: true, default: Date.now },
    rate: { type: Number, required: true },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' }
  },
  { timestamps: true }
);

DealSchema.pre('save', async function (next) {
  if (this.isNew) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const count = await mongoose.model('Deal').countDocuments();
    this.dealNumber = `DL-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const Deal = mongoose.model<IDealDocument>('Deal', DealSchema);
