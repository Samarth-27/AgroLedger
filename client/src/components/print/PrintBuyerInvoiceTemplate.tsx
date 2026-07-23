import { forwardRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';

export const PrintBuyerInvoiceTemplate = forwardRef<HTMLDivElement, { invoice: any }>(({ invoice }, ref) => {
  if (!invoice) return null;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">JAIN & JAIN MANDI ERP</Typography>
        <Typography variant="subtitle1">Commission Agent & Adhat Business</Typography>
        <Typography variant="body2">123 Mandi Road, Agricultural Market, State</Typography>
        <Typography variant="h5" sx={{ mt: 2, textDecoration: 'underline' }}>TAX INVOICE</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="body1"><strong>Buyer Name:</strong> {invoice.buyer?.name}</Typography>
          <Typography variant="body1"><strong>GSTIN:</strong> {invoice.buyer?.gstNumber || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Address:</strong> {invoice.buyer?.address}</Typography>
        </Box>
        <Box>
          <Typography variant="body1"><strong>Invoice No:</strong> {invoice.invoiceNumber}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Table size="small" sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total Goods Value (Gross Amount)</TableCell>
            <TableCell align="right">{invoice.grossAmount.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Add: Commission / Adhat</TableCell>
            <TableCell align="right">+ {invoice.commissionAmount.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Add: Mandi Tax (Buyer Borne)</TableCell>
            <TableCell align="right">+ {invoice.mandiTaxAmount.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Add: CGST</TableCell>
            <TableCell align="right">+ {invoice.cgstAmount.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Add: SGST</TableCell>
            <TableCell align="right">+ {invoice.sgstAmount.toFixed(2)}</TableCell>
          </TableRow>
          {invoice.igstAmount > 0 && (
            <TableRow>
              <TableCell>Add: IGST</TableCell>
              <TableCell align="right">+ {invoice.igstAmount.toFixed(2)}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell><strong>Net Invoice Amount</strong></TableCell>
            <TableCell align="right"><strong>{invoice.netAmount.toFixed(2)}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1">Buyer Signature</Typography>
        <Typography variant="body1">Authorized Signatory</Typography>
      </Box>
    </Box>
  );
});
