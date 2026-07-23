import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { IJForm, IBuyerInvoice, IPaymentReceipt, IApiResponse } from '@mandi-erp/shared';

export const useJForms = () => {
  return useQuery({
    queryKey: ['jforms'],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IJForm[]>>('/billing/jforms');
      return data.data;
    }
  });
};

export const useGenerateJForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dealId: string) => {
      const { data } = await apiClient.post<IApiResponse<IJForm>>('/billing/jforms/generate', { dealId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jforms'] });
      // Invalidate deals because the status is changed to BILLED
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
      const { data } = await apiClient.get<IApiResponse<IBuyerInvoice[]>>('/billing/invoices');
      return data.data;
    }
  });
};

export const useGenerateBuyerInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ buyerId, dealIds }: { buyerId: string, dealIds: string[] }) => {
      const { data } = await apiClient.post<IApiResponse<IBuyerInvoice>>('/billing/invoices/generate', { buyerId, dealIds });
      return data.data;
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
      const { data } = await apiClient.get<IApiResponse<IPaymentReceipt[]>>('/billing/payments');
      return data.data;
    }
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentData: any) => {
      const { data } = await apiClient.post<IApiResponse<IPaymentReceipt>>('/billing/payments', paymentData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['jforms'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
};
