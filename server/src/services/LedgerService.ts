import { LedgerTransaction } from '../models/LedgerTransaction';
import { AccountHead } from '../models/AccountHead';
import { AppError } from '../utils/AppError';

export class LedgerService {
  
  // Ensures default accounts exist
  async getOrCreateAccount(name: string, type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE') {
    let account = await AccountHead.findOne({ name });
    if (!account) {
      account = await AccountHead.create({ name, type });
    }
    return account;
  }

  async postJForm(jForm: any, session?: any) {
    const purchaseAcc = await this.getOrCreateAccount('Purchases', 'EXPENSE');
    const commissionAcc = await this.getOrCreateAccount('Commission Payable', 'LIABILITY');
    const mandiTaxAcc = await this.getOrCreateAccount('Mandi Tax Payable', 'LIABILITY');
    const kkfAcc = await this.getOrCreateAccount('KKF Payable', 'LIABILITY');
    const labourAcc = await this.getOrCreateAccount('Labour Charges Payable', 'LIABILITY');
    const farmerAcc = await this.getOrCreateAccount('Sundry Creditors - Farmers', 'LIABILITY');

    const lines: any[] = [
      {
        accountId: purchaseAcc._id,
        accountName: purchaseAcc.name,
        debit: jForm.grossAmount,
        credit: 0
      }
    ];

    if (jForm.commissionExpense > 0) {
      lines.push({ accountId: commissionAcc._id, accountName: commissionAcc.name, debit: 0, credit: jForm.commissionExpense });
    }
    if (jForm.mandiTax > 0) {
      lines.push({ accountId: mandiTaxAcc._id, accountName: mandiTaxAcc.name, debit: 0, credit: jForm.mandiTax });
    }
    if (jForm.kkf > 0) {
      lines.push({ accountId: kkfAcc._id, accountName: kkfAcc.name, debit: 0, credit: jForm.kkf });
    }
    if (jForm.labourExpense > 0) {
      lines.push({ accountId: labourAcc._id, accountName: labourAcc.name, debit: 0, credit: jForm.labourExpense });
    }
    
    // Net Payable to Farmer
    lines.push({
      accountId: farmerAcc._id,
      accountName: farmerAcc.name,
      partyId: jForm.farmerId,
      partyModel: 'Farmer',
      debit: 0,
      credit: jForm.netAmount
    });

    await LedgerTransaction.create([{
      date: jForm.date,
      voucherType: 'J-FORM',
      voucherNumber: jForm.jFormNumber,
      referenceId: jForm._id,
      narration: `J-Form generated for ${jForm.netAmount}`,
      lines
    }], { session });
  }

  async postBuyerInvoice(invoice: any, session?: any) {
    const salesAcc = await this.getOrCreateAccount('Sales', 'REVENUE');
    const commissionAcc = await this.getOrCreateAccount('Commission Income', 'REVENUE');
    const mandiTaxAcc = await this.getOrCreateAccount('Mandi Tax Payable', 'LIABILITY');
    const cgstAcc = await this.getOrCreateAccount('CGST Payable', 'LIABILITY');
    const sgstAcc = await this.getOrCreateAccount('SGST Payable', 'LIABILITY');
    const igstAcc = await this.getOrCreateAccount('IGST Payable', 'LIABILITY');
    const buyerAcc = await this.getOrCreateAccount('Sundry Debtors - Buyers', 'ASSET');

    const lines: any[] = [
      {
        accountId: buyerAcc._id,
        accountName: buyerAcc.name,
        partyId: invoice.buyerId,
        partyModel: 'Buyer',
        debit: invoice.netAmount,
        credit: 0
      },
      {
        accountId: salesAcc._id,
        accountName: salesAcc.name,
        debit: 0,
        credit: invoice.grossAmount
      }
    ];

    if (invoice.commissionAmount > 0) {
      lines.push({ accountId: commissionAcc._id, accountName: commissionAcc.name, debit: 0, credit: invoice.commissionAmount });
    }
    if (invoice.mandiTaxAmount > 0) {
      lines.push({ accountId: mandiTaxAcc._id, accountName: mandiTaxAcc.name, debit: 0, credit: invoice.mandiTaxAmount });
    }
    if (invoice.cgstAmount > 0) {
      lines.push({ accountId: cgstAcc._id, accountName: cgstAcc.name, debit: 0, credit: invoice.cgstAmount });
    }
    if (invoice.sgstAmount > 0) {
      lines.push({ accountId: sgstAcc._id, accountName: sgstAcc.name, debit: 0, credit: invoice.sgstAmount });
    }
    if (invoice.igstAmount > 0) {
      lines.push({ accountId: igstAcc._id, accountName: igstAcc.name, debit: 0, credit: invoice.igstAmount });
    }

    await LedgerTransaction.create([{
      date: invoice.date,
      voucherType: 'INVOICE',
      voucherNumber: invoice.invoiceNumber,
      referenceId: invoice._id,
      narration: `Invoice generated for ${invoice.netAmount}`,
      lines
    }], { session });
  }

  async postPaymentReceipt(payment: any, session?: any) {
    const cashAcc = await this.getOrCreateAccount('Cash', 'ASSET');
    const bankAcc = await this.getOrCreateAccount('Bank Accounts', 'ASSET');
    const farmerAcc = await this.getOrCreateAccount('Sundry Creditors - Farmers', 'LIABILITY');
    const buyerAcc = await this.getOrCreateAccount('Sundry Debtors - Buyers', 'ASSET');

    const modeAcc = payment.mode === 'CASH' ? cashAcc : bankAcc;
    const partyAcc = payment.partyModel === 'Farmer' ? farmerAcc : buyerAcc;

    const lines: any[] = [];

    if (payment.type === 'PAYMENT') {
      // Dr. Party, Cr. Cash/Bank
      lines.push({
        accountId: partyAcc._id,
        accountName: partyAcc.name,
        partyId: payment.partyId,
        partyModel: payment.partyModel,
        debit: payment.amount,
        credit: 0
      });
      lines.push({
        accountId: modeAcc._id,
        accountName: modeAcc.name,
        debit: 0,
        credit: payment.amount
      });
    } else {
      // Dr. Cash/Bank, Cr. Party
      lines.push({
        accountId: modeAcc._id,
        accountName: modeAcc.name,
        debit: payment.amount,
        credit: 0
      });
      lines.push({
        accountId: partyAcc._id,
        accountName: partyAcc.name,
        partyId: payment.partyId,
        partyModel: payment.partyModel,
        debit: 0,
        credit: payment.amount
      });
    }

    await LedgerTransaction.create([{
      date: payment.date,
      voucherType: payment.type,
      voucherNumber: payment.voucherNumber,
      referenceId: payment._id,
      narration: payment.reference || `Voucher ${payment.voucherNumber}`,
      lines
    }], { session });
  }

  async getTrialBalance() {
    const result = await LedgerTransaction.aggregate([
      { $unwind: '$lines' },
      {
        $group: {
          _id: { accountId: '$lines.accountId', accountName: '$lines.accountName' },
          totalDebit: { $sum: '$lines.debit' },
          totalCredit: { $sum: '$lines.credit' }
        }
      },
      {
        $project: {
          _id: 0,
          accountId: '$_id.accountId',
          accountName: '$_id.accountName',
          totalDebit: 1,
          totalCredit: 1,
          balance: { $subtract: ['$totalDebit', '$totalCredit'] }
        }
      },
      { $sort: { accountName: 1 } }
    ]);
    
    // Normalize Decimal128 back to numbers
    return result.map(r => ({
      ...r,
      totalDebit: Number(r.totalDebit?.toString() || 0),
      totalCredit: Number(r.totalCredit?.toString() || 0),
      balance: Number(r.balance?.toString() || 0)
    }));
  }

  async getAccountLedger(accountId?: string, partyId?: string) {
    const match: any = {};
    if (accountId) match['lines.accountId'] = accountId;
    if (partyId) match['lines.partyId'] = partyId;

    const txns = await LedgerTransaction.find(match).sort({ date: 1 }).populate('lines.accountId').lean();
    return txns;
  }
}

export const ledgerService = new LedgerService();
