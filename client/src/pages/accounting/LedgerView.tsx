import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { useAccountLedger } from '@hooks/useLedger';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

export const LedgerView = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const accountId = searchParams.get('accountId') || undefined;
  const partyId = searchParams.get('partyId') || undefined;

  const { data: transactions, isLoading } = useAccountLedger(accountId, partyId);

  let runningBalance = 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Ledger Statement</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Voucher</TableCell>
                <TableCell>Particulars</TableCell>
                <TableCell align="right">Debit (₹)</TableCell>
                <TableCell align="right">Credit (₹)</TableCell>
                <TableCell align="right">Balance (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : transactions?.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>No transactions found for this account.</TableCell></TableRow>
              ) : (
                transactions?.map((row: any) => {
                  // Find the leg that matches this ledger view
                  // If we don't have accountId, just show all lines as general journal (complex)
                  // For simplicity in MVP, we just show the lines
                  
                  return row.lines.map((line: any, idx: number) => {
                    // Only show the line matching the filter, or all if no filter
                    if ((accountId && line.accountId?._id !== accountId) && (partyId && line.partyId !== partyId)) {
                        return null; // This line is not for the current ledger
                    }
                    
                    const debit = parseFloat(line.debit?.toString() || '0');
                    const credit = parseFloat(line.credit?.toString() || '0');
                    
                    runningBalance += (debit - credit);
                    
                    return (
                      <TableRow hover key={`${row._id}-${idx}`}>
                        <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{row.voucherNumber} ({row.voucherType})</TableCell>
                        <TableCell>
                          <Typography variant="body2">{line.accountName}</Typography>
                          <Typography variant="caption" color="textSecondary">{row.narration}</Typography>
                        </TableCell>
                        <TableCell align="right">{debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}</TableCell>
                        <TableCell align="right">{credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: runningBalance > 0 ? 'info.main' : runningBalance < 0 ? 'error.main' : 'inherit' }}>
                          {Math.abs(runningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })} {runningBalance > 0 ? 'Dr' : runningBalance < 0 ? 'Cr' : ''}
                        </TableCell>
                      </TableRow>
                    );
                  });
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
