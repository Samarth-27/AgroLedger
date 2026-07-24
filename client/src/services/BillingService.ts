import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';
import { ledgerService } from './LedgerService';
import { IJForm, IBuyerInvoice } from '@mandi-erp/shared';

const generateCode = (prefix: string, count: number) => `${prefix}-${(count + 1).toString().padStart(4, '0')}`;

export class BillingService {
  async getSetting(key: string, defaultValue: number) {
    const setting = await db.settings.where('key').equals(key).first();
    return setting ? Number(setting.value) : defaultValue;
  }

  async generateJForm(dealId: string) {
    const deal = await db.deals.get(dealId);
    if (!deal) throw new Error('Deal not found');
    
    const arrival = await db.arrivals.get(deal.arrivalId);
    if (!arrival) throw new Error('Arrival not found');

    const commodity = await db.commodities.get(arrival.commodityId);
    const buyer = await db.buyers.get(deal.buyerId);
    const farmer = await db.farmers.get(arrival.farmerId);

    if (!commodity || !buyer || !farmer) throw new Error('Related entities not found');

    const grossAmount = deal.rate * arrival.weight;
    const commissionRate = buyer.commissionRate || 0;
    const commissionExpense = (grossAmount * commissionRate) / 100;

    const palledariRate = await this.getSetting('PALLEDARI_RATE_PER_BAG', 2);
    const hamaliRate = await this.getSetting('HAMALI_RATE_PER_BAG', 3);
    const tulaiRate = await this.getSetting('TULAI_RATE_PER_BAG', 1);

    const palledari = arrival.bags * palledariRate;
    const hamali = arrival.bags * hamaliRate;
    const tulai = arrival.bags * tulaiRate;
    const labourExpense = palledari + hamali + tulai;

    const kkfRate = commodity.kkfRate || 0;
    const mandiTaxRate = commodity.mandiTaxRate || 0;
    const kkf = (grossAmount * kkfRate) / 100;
    const mandiTax = (grossAmount * mandiTaxRate) / 100;

    const netAmount = grossAmount - commissionExpense - labourExpense - kkf - mandiTax;

    const jFormCount = await db.jforms.count();
    
    const jForm = {
      _id: uuidv4(),
      jFormNumber: generateCode('JF', jFormCount),
      dealId: deal._id,
      farmerId: farmer._id,
      date: new Date().toISOString(),
      grossAmount,
      commissionExpense,
      palledari,
      hamali,
      tulai,
      kkf,
      mandiTax,
      labourExpense,
      netAmount,
      status: 'UNPAID'
    } as IJForm;

    await db.transaction('rw', db.jforms, db.deals, db.arrivals, db.ledger, db.accountHeads, async () => {
      await db.jforms.add(jForm);
      await db.deals.update(dealId, { status: 'BILLED' });
      await db.arrivals.update(arrival._id, { status: 'BILLED' });
      await ledgerService.postJForm(jForm);
    });

    return jForm;
  }

  async generateBuyerInvoice(buyerId: string, dealIds: string[]) {
    const buyer = await db.buyers.get(buyerId);
    if (!buyer) throw new Error('Buyer not found');

    let grossAmount = 0;
    let commissionAmount = 0;
    let mandiTaxAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    for (const dealId of dealIds) {
      const deal = await db.deals.get(dealId);
      if (!deal) continue;
      const arrival = await db.arrivals.get(deal.arrivalId);
      if (!arrival) continue;
      const commodity = await db.commodities.get(arrival.commodityId);
      if (!commodity) continue;

      const dealGross = deal.rate * arrival.weight;
      grossAmount += dealGross;
      commissionAmount += (dealGross * (buyer.commissionRate || 0)) / 100;
      mandiTaxAmount += (dealGross * (commodity.mandiTaxRate || 0)) / 100;
      cgstAmount += (dealGross * (commodity.cgst || 0)) / 100;
      sgstAmount += (dealGross * (commodity.sgst || 0)) / 100;
    }

    const netAmount = grossAmount + commissionAmount + mandiTaxAmount + cgstAmount + sgstAmount + igstAmount;

    const count = await db.invoices.count();
    const invoice = {
      _id: uuidv4(),
      invoiceNumber: generateCode('INV', count),
      buyerId,
      dealIds,
      date: new Date().toISOString(),
      grossAmount,
      commissionAmount,
      mandiTaxAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      netAmount,
      status: 'UNPAID'
    } as IBuyerInvoice;

    await db.transaction('rw', db.invoices, db.deals, db.ledger, db.accountHeads, async () => {
      await db.invoices.add(invoice);
      for (const dealId of dealIds) {
        await db.deals.update(dealId, { status: 'BILLED' });
      }
      await ledgerService.postBuyerInvoice(invoice);
    });

    return invoice;
  }
}

export const billingService = new BillingService();
