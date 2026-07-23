import mongoose, { Schema, Document } from 'mongoose';
import { IBuyerInvoice } from '@mandi-erp/shared';

export interface IBuyerInvoiceDocument extends Omit<IBuyerInvoice, '_id' | 'buyer' | 'deals'>, Document {
  invoiceNumber: string;
}

const BuyerInvoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, unique: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    dealIds: [{ type: Schema.Types.ObjectId, ref: 'Deal' }],
    date: { type: Date, required: true },
    grossAmount: { type: Number, required: true },
    commissionAmount: { type: Number, default: 0 },
    mandiTaxAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    status: { type: String, enum: ['UNPAID', 'PARTIAL', 'PAID'], default: 'UNPAID' },
  },
  { timestamps: true }
);

BuyerInvoiceSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model('BuyerInvoice').countDocuments();
    this.invoiceNumber = `INV-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

export const BuyerInvoice = mongoose.model<IBuyerInvoiceDocument>('BuyerInvoice', BuyerInvoiceSchema);
