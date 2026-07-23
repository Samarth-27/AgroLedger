import { PaymentReceipt } from '../models/PaymentReceipt';
import { AppError } from '../utils/AppError';
import { PaymentReceiptSchema } from '@mandi-erp/shared';
import { ledgerService } from './LedgerService';

export class PaymentReceiptService {
  async createRecord(data: any) {
    const validated = PaymentReceiptSchema.parse(data);
    
    // Fetch last voucher to increment number
    const count = await PaymentReceipt.countDocuments();
    const prefix = validated.type === 'PAYMENT' ? 'PMT' : 'RCT';
    const voucherNumber = `${prefix}-${String(count + 1).padStart(5, '0')}`;
    
    const payment = await PaymentReceipt.create({ ...validated, voucherNumber });

    // Post to Ledger
    await ledgerService.postPaymentReceipt(payment);

    // TODO: Update Outstanding balance on Farmer/Buyer/Invoice/JForm models

    return payment;
  }

  async getAll() {
    return await PaymentReceipt.find().populate('partyId').sort({ date: -1 });
  }

  async getById(id: string) {
    const record = await PaymentReceipt.findById(id).populate('partyId');
    if (!record) throw new AppError('Record not found', 404);
    return record;
  }

  async getByParty(partyId: string) {
    return await PaymentReceipt.find({ partyId }).sort({ date: -1 });
  }
}

export const paymentReceiptService = new PaymentReceiptService();
