import { jFormRepository } from '../repositories/JFormRepository';
import { dealService } from './DealService';
import { arrivalService } from './ArrivalService';
import { AppError } from '../utils/AppError';
import { JFormSchema } from '@mandi-erp/shared';
import { ledgerService } from './LedgerService';
import { settingService } from './SettingService';

export class JFormService {
  async generateJForm(dealId: string) {
    const deal = await dealService.getDealById(dealId);
    if (!deal) throw new AppError('Deal not found', 404);
    if (deal.status !== 'CONFIRMED') throw new AppError('Only CONFIRMED deals can be billed', 400);

    const arrival = deal.arrival;
    const commodity = arrival.commodity;
    const buyer = deal.buyer;
    const farmer = arrival.farmer;

    // Calculations
    const grossAmount = deal.rate * arrival.weight;
    
    // Commission is pulled from the Buyer's commissionRate (percentage)
    const commissionRate = buyer.commissionRate || 0;
    const commissionExpense = (grossAmount * commissionRate) / 100;

    // Labour expenses (Fetched dynamically from System Settings)
    const PALLEDARI_RATE_PER_BAG = Number(await settingService.getSetting('PALLEDARI_RATE_PER_BAG'));
    const HAMALI_RATE_PER_BAG = Number(await settingService.getSetting('HAMALI_RATE_PER_BAG'));
    const TULAI_RATE_PER_BAG = Number(await settingService.getSetting('TULAI_RATE_PER_BAG'));

    const palledari = arrival.bags * PALLEDARI_RATE_PER_BAG;
    const hamali = arrival.bags * HAMALI_RATE_PER_BAG;
    const tulai = arrival.bags * TULAI_RATE_PER_BAG;
    const labourExpense = palledari + hamali + tulai;

    // Taxes
    const kkfRate = commodity.kkfRate || 0;
    const mandiTaxRate = commodity.mandiTaxRate || 0;
    const kkf = (grossAmount * kkfRate) / 100;
    const mandiTax = (grossAmount * mandiTaxRate) / 100;

    // Net Amount
    const netAmount = grossAmount - commissionExpense - labourExpense - kkf - mandiTax;

    const jFormData = {
      dealId: deal._id.toString(),
      farmerId: farmer._id.toString(),
      date: new Date(),
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
    };

    const validated = JFormSchema.parse(jFormData);
    const jForm = await jFormRepository.create(validated);

    // Update the Deal to BILLED
    await dealService.updateStatus(dealId, 'BILLED');
    
    // Also update Arrival to BILLED to reflect complete lifecycle
    await arrivalService.updateStatus(arrival._id as string, 'BILLED');

    // Post to Ledger
    await ledgerService.postJForm(jForm);

    return jForm;
  }

  async getJForms() {
    const jForms = await jFormRepository.findWithDetails();
    return jForms.map(this.mapJFormToDTO);
  }

  async getJFormById(id: string) {
    const jForm = await jFormRepository.findByIdWithDetails(id);
    if (!jForm) throw new AppError('JForm not found', 404);
    return this.mapJFormToDTO(jForm);
  }

  private mapJFormToDTO(jf: any) {
    return {
      _id: jf._id,
      jFormNumber: jf.jFormNumber,
      deal: jf.dealId,
      farmer: jf.farmerId,
      date: jf.date,
      grossAmount: jf.grossAmount,
      commissionExpense: jf.commissionExpense,
      palledari: jf.palledari,
      hamali: jf.hamali,
      tulai: jf.tulai,
      kkf: jf.kkf,
      mandiTax: jf.mandiTax,
      labourExpense: jf.labourExpense,
      netAmount: jf.netAmount,
      status: jf.status,
      createdAt: jf.createdAt,
    };
  }
}

export const jFormService = new JFormService();
