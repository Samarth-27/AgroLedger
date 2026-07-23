import { BuyerInvoice } from '../models/BuyerInvoice';
import { dealService } from './DealService';
import { AppError } from '../utils/AppError';
import { BuyerInvoiceSchema } from '@mandi-erp/shared';
import { ledgerService } from './LedgerService';

export class BuyerInvoiceService {
  async generateInvoice(buyerId: string, dealIds: string[]) {
    // 1. Fetch Deals
    const deals = await Promise.all(dealIds.map(id => dealService.getDealById(id)));
    
    // Validation
    deals.forEach(deal => {
      if (!deal) throw new AppError('One or more deals not found', 404);
      if (deal.buyer._id.toString() !== buyerId) throw new AppError('All deals must belong to the same buyer', 400);
      if (deal.status !== 'CONFIRMED' && deal.status !== 'BILLED') throw new AppError(`Deal ${deal.dealNumber} cannot be billed`, 400);
    });

    // 2. Calculations
    let grossAmount = 0;
    let commissionAmount = 0;
    let mandiTaxAmount = 0;
    
    deals.forEach(deal => {
      const arrival = deal.arrival;
      const commodity = arrival.commodity;
      const buyer = deal.buyer;
      
      const dealGross = deal.rate * arrival.weight;
      const dealComm = (dealGross * (buyer.commissionRate || 0)) / 100;
      const dealMandiTax = (dealGross * (commodity.mandiTaxRate || 0)) / 100;
      
      grossAmount += dealGross;
      commissionAmount += dealComm;
      mandiTaxAmount += dealMandiTax;
    });

    // 3. GST Calculation (Simplified intra-state 5% total for demo, can be expanded)
    // To do it properly: calculate SGST/CGST based on commodity rates on Commission
    // Assuming agricultural produce itself is exempt but commission is taxable at 18% (9% SGST, 9% CGST)
    const CGST_RATE = 9;
    const SGST_RATE = 9;
    
    const cgstAmount = (commissionAmount * CGST_RATE) / 100;
    const sgstAmount = (commissionAmount * SGST_RATE) / 100;
    const igstAmount = 0;

    const netAmount = grossAmount + commissionAmount + mandiTaxAmount + cgstAmount + sgstAmount + igstAmount;

    // 4. Create Invoice
    const invoiceData = {
      buyerId,
      dealIds,
      date: new Date(),
      grossAmount,
      commissionAmount,
      mandiTaxAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      netAmount,
      status: 'UNPAID'
    };

    const validated = BuyerInvoiceSchema.parse(invoiceData);
    const invoice = await BuyerInvoice.create(validated);

    // Mark deals as billed
    for (const deal of deals) {
      await dealService.updateStatus(deal._id as string, 'BILLED');
    }

    // Post to Ledger
    await ledgerService.postBuyerInvoice(invoice);

    return invoice;
  }

  async getAllInvoices() {
    return await BuyerInvoice.find().populate('buyerId').populate({ path: 'dealIds', populate: { path: 'arrivalId', populate: 'commodityId' } });
  }

  async getInvoiceById(id: string) {
    const invoice = await BuyerInvoice.findById(id).populate('buyerId').populate({ path: 'dealIds', populate: { path: 'arrivalId', populate: 'commodityId' } });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }
}

export const buyerInvoiceService = new BuyerInvoiceService();
