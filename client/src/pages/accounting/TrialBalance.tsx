import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { useTrialBalance } from '@hooks/useLedger';

export const TrialBalance = () => {
  const { data: trialBalance, isLoading } = useTrialBalance();

  let totalDebit = 0;
  let totalCredit = 0;

  if (trialBalance) {
    trialBalance.forEach((row: any) => {
      totalDebit += row.totalDebit;
      totalCredit += row.totalCredit;
    });
  }

  const diff = Math.abs(totalDebit - totalCredit);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Trial Balance</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Account Name</TableCell>
                <TableCell align="right">Debit (₹)</TableCell>
                <TableCell align="right">Credit (₹)</TableCell>
                <TableCell align="right">Closing Balance (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : trialBalance?.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No transactions found.</TableCell></TableRow>
              ) : (
                trialBalance?.map((row: any) => {
                  const isDebitBalance = row.balance > 0;
                  const isCreditBalance = row.balance < 0;
                  
                  return (
                    <TableRow hover key={row.accountId || row.accountName}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.accountName}</TableCell>
                      <TableCell align="right">{row.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell align="right">{row.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: isDebitBalance ? 'info.main' : isCreditBalance ? 'error.main' : 'inherit' }}>
                        {isDebitBalance ? `${Math.abs(row.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Dr` : 
                         isCreditBalance ? `${Math.abs(row.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr` : 
                         '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              
              {!isLoading && (
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell><strong>TOTALS</strong></TableCell>
                  <TableCell align="right"><strong>{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></TableCell>
                  <TableCell align="right"><strong>{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></TableCell>
                  <TableCell align="right">
                    {diff > 0.01 ? (
                      <Typography color="error" fontWeight="bold">Diff: {diff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                    ) : (
                      <Typography color="success.main" fontWeight="bold">BALANCED</Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
