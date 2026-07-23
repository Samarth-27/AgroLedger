import { forwardRef } from 'react';
import { Box, Typography, Divider } from '@mui/material';

export const PrintPaymentTemplate = forwardRef<HTMLDivElement, { payment: any }>(({ payment }, ref) => {
  if (!payment) return null;

  const isReceipt = payment.type === 'RECEIPT';

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black', width: '210mm', height: '148mm' /* Half A4 (A5 Landscape) */ }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">JAIN & JAIN MANDI ERP</Typography>
        <Typography variant="subtitle2">123 Mandi Road, Agricultural Market, State</Typography>
        <Typography variant="h6" sx={{ mt: 2, textDecoration: 'underline' }}>
          {isReceipt ? 'CASH/BANK RECEIPT' : 'CASH/BANK PAYMENT VOUCHER'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body1"><strong>Voucher No:</strong> {payment.voucherNumber}</Typography>
        <Typography variant="body1"><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isReceipt ? 'Received with thanks from:' : 'Paid to:'} <strong>{payment.partyId?.name} ({payment.partyModel})</strong>
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 2 }}>
          The sum of Rupees: <strong>₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          By {payment.mode} {payment.reference ? `(Ref: ${payment.reference})` : ''}
        </Typography>
      </Box>

      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1">Receiver's Signature</Typography>
        <Typography variant="body1">Authorized Signatory</Typography>
      </Box>
    </Box>
  );
});
