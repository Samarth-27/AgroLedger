import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useBuyerInvoices } from '@hooks/useBilling';
import { format } from 'date-fns';
import { useState, useRef } from 'react';
import { PrintBuyerInvoiceTemplate } from '@components/print/PrintBuyerInvoiceTemplate';

export const BuyerInvoiceList = () => {
  const { data: invoices, isLoading } = useBuyerInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const onPrintClick = (invoice: any) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Buyer Invoices</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Invoice No.</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Gross Amt (₹)</TableCell>
                <TableCell>Comm. + Tax (₹)</TableCell>
                <TableCell>Net Amount (₹)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : invoices?.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}>No invoices generated yet.</TableCell></TableRow>
              ) : (
                invoices?.map((row: any) => {
                  const taxes = row.commissionAmount + row.mandiTaxAmount + row.cgstAmount + row.sgstAmount + row.igstAmount;
                  return (
                    <TableRow hover key={row._id}>
                      <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{row.invoiceNumber}</TableCell>
                      <TableCell>{row.buyer?.name}</TableCell>
                      <TableCell>₹{row.grossAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell sx={{ color: 'warning.main' }}>+₹{taxes.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'success.main', fontSize: '1.1rem' }}>
                        ₹{row.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={row.status === 'PAID' ? 'success' : row.status === 'PARTIAL' ? 'info' : 'warning'} 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Print Invoice">
                          <IconButton color="secondary" onClick={() => onPrintClick(row)}>
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box 
        sx={{ 
          display: 'none',
          '@media print': {
            display: 'block',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'white',
            zIndex: 9999
          }
        }}
      >
        {selectedInvoice && <PrintBuyerInvoiceTemplate ref={printRef} invoice={selectedInvoice} />}
      </Box>
    </Box>
  );
};
