import mongoose, { Schema, Document } from 'mongoose';
import { ITransport } from '@mandi-erp/shared';

export interface ITransportDocument extends Omit<ITransport, '_id'>, Document {}

const TransportSchema = new Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String },
  },
  { timestamps: true }
);

export const Transport = mongoose.model<ITransportDocument>('Transport', TransportSchema);
