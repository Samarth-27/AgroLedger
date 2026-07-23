import mongoose, { Schema, Document } from 'mongoose';
import { IFarmer } from '@mandi-erp/shared';

export interface IFarmerDocument extends Omit<IFarmer, '_id'>, Document {
  code: string;
}

const FarmerSchema = new Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    mobile: { type: String, required: true },
    village: { type: String, required: true },
    bankDetails: {
      accountNo: { type: String },
      ifsc: { type: String },
      bankName: { type: String },
    },
  },
  { timestamps: true }
);

// Auto-generate Code
FarmerSchema.pre('save', async function (next) {
  if (this.isNew && !this.code) {
    const count = await mongoose.model('Farmer').countDocuments();
    this.code = `F-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const Farmer = mongoose.model<IFarmerDocument>('Farmer', FarmerSchema);
