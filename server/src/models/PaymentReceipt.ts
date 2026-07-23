import mongoose, { Schema, Document } from 'mongoose';
import { IPaymentReceipt } from '@mandi-erp/shared';

export interface IPaymentReceiptDocument extends Omit<IPaymentReceipt, '_id'>, Document {
  voucherNumber: string;
}

const PaymentReceiptSchema = new Schema(
  {
    voucherNumber: { type: String, unique: true },
    type: { type: String, enum: ['PAYMENT', 'RECEIPT'], required: true },
    partyId: { type: Schema.Types.ObjectId, required: true, refPath: 'partyModel' },
    partyModel: { type: String, enum: ['Farmer', 'Buyer'] }, // Discriminator hint
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    mode: { type: String, enum: ['CASH', 'BANK', 'CHEQUE', 'UPI'], required: true },
    reference: { type: String },
  },
  { timestamps: true }
);

PaymentReceiptSchema.pre('save', async function (next) {
  if (this.isNew && !this.voucherNumber) {
    const prefix = this.type === 'PAYMENT' ? 'PMT' : 'RCT';
    const count = await mongoose.model('PaymentReceipt').countDocuments({ type: this.type });
    this.voucherNumber = `${prefix}-${(count + 1).toString().padStart(5, '0')}`;
    
    // Auto-resolve partyModel if missing
    if (!this.partyModel) {
      if (this.type === 'PAYMENT') this.partyModel = 'Farmer';
      if (this.type === 'RECEIPT') this.partyModel = 'Buyer';
    }
  }
  next();
});

export const PaymentReceipt = mongoose.model<IPaymentReceiptDocument>('PaymentReceipt', PaymentReceiptSchema);
