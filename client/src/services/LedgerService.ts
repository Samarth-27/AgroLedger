import { db } from '../db/db';
import { v4 as uuidv4 } from 'uuid';

export class LedgerService {
  
  async getOrCreateAccount(name: string, type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE') {
    let account = await db.accountHeads.where('name').equals(name).first();
    if (!account) {
      account = { _id: uuidv4(), name, type };
      await db.accountHeads.add(account);
    }
    return account;
  }

  async postJForm(jForm: any) {
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
    
    lines.push({
      accountId: farmerAcc._id,
      accountName: farmerAcc.name,
      partyId: jForm.farmerId,
      partyModel: 'Farmer',
      debit: 0,
      credit: jForm.netAmount
    });

    await db.ledger.add({
      _id: uuidv4(),
      date: jForm.date,
      voucherType: 'J-FORM',
      voucherNumber: jForm.jFormNumber,
      referenceId: jForm._id,
      narration: `J-Form generated for ${jForm.netAmount}`,
      lines,
      isDeleted: false
    } as any);
  }

  async postBuyerInvoice(invoice: any) {
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

    await db.ledger.add({
      _id: uuidv4(),
      date: invoice.date,
      voucherType: 'INVOICE',
      voucherNumber: invoice.invoiceNumber,
      referenceId: invoice._id,
      narration: `Invoice generated for ${invoice.netAmount}`,
      lines,
      isDeleted: false
    } as any);
  }

  async postPaymentReceipt(payment: any) {
    const cashAcc = await this.getOrCreateAccount('Cash', 'ASSET');
    const bankAcc = await this.getOrCreateAccount('Bank Accounts', 'ASSET');
    const farmerAcc = await this.getOrCreateAccount('Sundry Creditors - Farmers', 'LIABILITY');
    const buyerAcc = await this.getOrCreateAccount('Sundry Debtors - Buyers', 'ASSET');

    const modeAcc = payment.mode === 'CASH' ? cashAcc : bankAcc;
    const partyAcc = payment.partyModel === 'Farmer' ? farmerAcc : buyerAcc;

    const lines: any[] = [];

    if (payment.type === 'PAYMENT') {
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

    await db.ledger.add({
      _id: uuidv4(),
      date: payment.date,
      voucherType: payment.type,
      voucherNumber: payment.voucherNumber,
      referenceId: payment._id,
      narration: payment.reference || `Voucher ${payment.voucherNumber}`,
      lines,
      isDeleted: false
    } as any);
  }

  async getTrialBalance() {
    const transactions = await db.ledger.toArray();
    const balances: Record<string, any> = {};

    for (const txn of transactions) {
      for (const line of txn.lines) {
        if (!balances[line.accountId]) {
          balances[line.accountId] = {
            accountId: line.accountId,
            accountName: line.accountName,
            totalDebit: 0,
            totalCredit: 0
          };
        }
        balances[line.accountId].totalDebit += line.debit;
        balances[line.accountId].totalCredit += line.credit;
      }
    }

    return Object.values(balances).map(b => ({
      ...b,
      balance: b.totalDebit - b.totalCredit
    })).sort((a, b) => a.accountName.localeCompare(b.accountName));
  }

  async getAccountLedger(accountId?: string, partyId?: string) {
    const transactions = await db.ledger.toArray();
    
    // Filter transactions that have at least one line matching criteria
    const filtered = transactions.filter(txn => {
      return txn.lines.some(line => {
        let match = true;
        if (accountId && line.accountId !== accountId) match = false;
        if (partyId && line.partyId !== partyId) match = false;
        return match;
      });
    });

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

export const ledgerService = new LedgerService();
