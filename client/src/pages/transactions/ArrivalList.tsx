import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useArrivals, useCreateArrival } from '@hooks/useTransactions';
import { ArrivalForm } from '@components/forms/ArrivalForm';
import { format } from 'date-fns';

export const ArrivalList = () => {
  const { data: arrivals, isLoading } = useArrivals();
  const createMutation = useCreateArrival();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Arrivals</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Register Arrival</Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Arrival No.</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Commodity</TableCell>
                <TableCell>Weight (Qtl)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : arrivals?.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>No arrivals found.</TableCell></TableRow>
              ) : (
                arrivals?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{row.arrivalNumber}</TableCell>
                    <TableCell>{row.farmer?.name}</TableCell>
                    <TableCell>{row.commodity?.name}</TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        color={row.status === 'PENDING' ? 'warning' : row.status === 'AUCTIONED' ? 'info' : 'success'} 
                        size="small" 
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ArrivalForm open={open} onClose={() => setOpen(false)} onSubmit={(data: any) => createMutation.mutate(data, { onSuccess: () => setOpen(false) })} isLoading={createMutation.isPending} />
    </Box>
  );
};
