import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../db/db';

import { billingService } from '../services/BillingService';
import { ledgerService } from '../services/LedgerService';
import { v4 as uuidv4 } from 'uuid';

export const useJForms = () => {
  return useQuery({
    queryKey: ['jforms'],
    queryFn: async () => {
      const jforms = await db.jforms.toArray();
      const populated = await Promise.all(jforms.map(async (jf) => {
        const deal = await db.deals.get(jf.dealId);
        const farmer = await db.farmers.get(jf.farmerId);
        return { ...jf, deal, farmer };
      }));
      return populated;
    }
  });
};

export const useGenerateJForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dealId: string) => {
      return await billingService.generateJForm(dealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jforms'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['arrivals'] });
    }
  });
};

// --- Buyer Invoices ---
export const useBuyerInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const invoices = await db.invoices.toArray();
      const populated = await Promise.all(invoices.map(async (inv) => {
        const buyer = await db.buyers.get(inv.buyerId);
        const deals = await Promise.all(inv.dealIds.map(id => db.deals.get(id)));
        return { ...inv, buyer, deals: deals.filter(Boolean) };
      }));
      return populated;
    }
  });
};

export const useGenerateBuyerInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ buyerId, dealIds }: { buyerId: string, dealIds: string[] }) => {
      return await billingService.generateBuyerInvoice(buyerId, dealIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });
};

// --- Payments & Receipts ---
export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      return await db.payments.toArray();
    }
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentData: any) => {
      const newPayment = {
        ...paymentData,
        _id: uuidv4()
      };
      await db.transaction('rw', db.payments, db.ledger, db.accountHeads, async () => {
        await db.payments.add(newPayment);
        await ledgerService.postPaymentReceipt(newPayment);
      });
      return newPayment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['jforms'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
};
