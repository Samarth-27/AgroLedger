import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { usePayments } from '@hooks/useBilling';
import { format } from 'date-fns';
import { useState, useRef } from 'react';
import { PrintPaymentTemplate } from '@components/print/PrintPaymentTemplate';

export const PaymentReceiptList = () => {
  const { data: payments, isLoading } = usePayments();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const onPrintClick = (payment: any) => {
    setSelectedPayment(payment);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payments & Receipts</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Voucher No.</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : payments?.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}>No payments recorded yet.</TableCell></TableRow>
              ) : (
                payments?.map((row: any) => {
                  const isPayment = row.type === 'PAYMENT';
                  return (
                    <TableRow hover key={row._id}>
                      <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{row.voucherNumber}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.type} 
                          color={isPayment ? 'error' : 'success'} 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{row.partyId?.name} ({row.partyModel})</TableCell>
                      <TableCell>{row.mode}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isPayment ? 'error.main' : 'success.main', fontSize: '1.1rem' }}>
                        {isPayment ? '-' : '+'}₹{row.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{row.reference || '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Print Voucher">
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
        {selectedPayment && <PrintPaymentTemplate ref={printRef} payment={selectedPayment} />}
      </Box>
    </Box>
  );
};
