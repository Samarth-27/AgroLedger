import mongoose, { Schema, Document } from 'mongoose';
import { IVehicle } from '@mandi-erp/shared';

export interface IVehicleDocument extends Omit<IVehicle, '_id' | 'transportId'>, Document {
  transportId?: mongoose.Types.ObjectId | string;
}

const VehicleSchema = new Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    transportId: { type: Schema.Types.ObjectId, ref: 'Transport' },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema);
