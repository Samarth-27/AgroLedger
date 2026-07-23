import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useDeals, useCreateDeal } from '@hooks/useTransactions';
import { useGenerateJForm } from '@hooks/useBilling';
import { DealForm } from '@components/forms/DealForm';
import { format } from 'date-fns';

export const DealList = () => {
  const { data: deals, isLoading } = useDeals();
  const createMutation = useCreateDeal();
  const generateBillMutation = useGenerateJForm();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Deals & Auctions</Typography>
        <Button variant="contained" color="secondary" startIcon={<GavelIcon />} onClick={() => setOpen(true)}>New Deal</Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Deal No.</TableCell>
                <TableCell>Arrival No.</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Commodity</TableCell>
                <TableCell>Rate (₹/Qtl)</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : deals?.length === 0 ? (
                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3 }}>No deals found.</TableCell></TableRow>
              ) : (
                deals?.map((row: any) => {
                  const weight = row.arrival?.weight || 0;
                  const value = weight * row.rate;
                  return (
                    <TableRow hover key={row._id}>
                      <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{row.dealNumber}</TableCell>
                      <TableCell>{row.arrival?.arrivalNumber}</TableCell>
                      <TableCell>{row.arrival?.farmer?.name}</TableCell>
                      <TableCell>{row.buyer?.name}</TableCell>
                      <TableCell>{row.arrival?.commodity?.name}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'secondary.main' }}>₹{row.rate}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={row.status === 'CONFIRMED' ? 'warning' : row.status === 'BILLED' ? 'success' : 'error'} 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {row.status === 'CONFIRMED' && (
                          <Tooltip title="Generate J-Form (Bill)">
                            <IconButton 
                              color="primary" 
                              onClick={() => generateBillMutation.mutate(row._id)}
                              disabled={generateBillMutation.isPending}
                            >
                              <ReceiptIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <DealForm open={open} onClose={() => setOpen(false)} onSubmit={(data: any) => createMutation.mutate(data, { onSuccess: () => setOpen(false) })} isLoading={createMutation.isPending} />
    </Box>
  );
};
