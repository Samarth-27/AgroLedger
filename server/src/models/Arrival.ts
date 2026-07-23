import mongoose, { Schema, Document } from 'mongoose';
import { IArrival } from '@mandi-erp/shared';

export interface IArrivalDocument extends Omit<IArrival, '_id' | 'farmer' | 'commodity' | 'farmerId' | 'commodityId'>, Document {
  farmerId: mongoose.Types.ObjectId | string;
  commodityId: mongoose.Types.ObjectId | string;
}

const ArrivalSchema = new Schema(
  {
    arrivalNumber: { type: String, unique: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    commodityId: { type: Schema.Types.ObjectId, ref: 'Commodity', required: true },
    date: { type: Date, required: true, default: Date.now },
    bags: { type: Number, required: true },
    weight: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'AUCTIONED', 'BILLED'], default: 'PENDING' }
  },
  { timestamps: true }
);

ArrivalSchema.pre('save', async function (next) {
  if (this.isNew) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const count = await mongoose.model('Arrival').countDocuments();
    this.arrivalNumber = `ARR-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const Arrival = mongoose.model<IArrivalDocument>('Arrival', ArrivalSchema);
