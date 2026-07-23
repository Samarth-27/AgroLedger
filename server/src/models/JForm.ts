import mongoose, { Schema, Document } from 'mongoose';
import { IJForm } from '@mandi-erp/shared';

export interface IJFormDocument extends Omit<IJForm, '_id' | 'deal' | 'farmer' | 'dealId' | 'farmerId'>, Document {
  dealId: mongoose.Types.ObjectId | string;
  farmerId: mongoose.Types.ObjectId | string;
}

const JFormSchema = new Schema(
  {
    jFormNumber: { type: String, unique: true },
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    date: { type: Date, required: true, default: Date.now },
    grossAmount: { type: Number, required: true },
    commissionExpense: { type: Number, required: true, default: 0 },
    palledari: { type: Number, default: 0 },
    hamali: { type: Number, default: 0 },
    tulai: { type: Number, default: 0 },
    kkf: { type: Number, default: 0 },
    mandiTax: { type: Number, default: 0 },
    labourExpense: { type: Number, required: true, default: 0 },
    netAmount: { type: Number, required: true },
    status: { type: String, enum: ['UNPAID', 'PARTIAL', 'PAID'], default: 'UNPAID' }
  },
  { timestamps: true }
);

JFormSchema.pre('save', async function (next) {
  if (this.isNew) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const count = await mongoose.model('JForm').countDocuments();
    this.jFormNumber = `JF-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const JForm = mongoose.model<IJFormDocument>('JForm', JFormSchema);
