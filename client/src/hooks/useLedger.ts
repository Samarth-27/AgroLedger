import { useQuery } from '@tanstack/react-query';
import { ledgerService } from '../services/LedgerService';

export const useTrialBalance = () => {
  return useQuery({
    queryKey: ['trial-balance'],
    queryFn: async () => {
      return await ledgerService.getTrialBalance();
    }
  });
};

export const useAccountLedger = (accountId?: string, partyId?: string) => {
  return useQuery({
    queryKey: ['ledger', accountId, partyId],
    queryFn: async () => {
      return await ledgerService.getAccountLedger(accountId, partyId);
    }
  });
};
