import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useBuyers, useCreateBuyer } from '@hooks/useMasters';
import { BuyerForm } from '@components/forms/BuyerForm';

export const BuyerList = () => {
  const { data: buyers, isLoading } = useBuyers();
  const createMutation = useCreateBuyer();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Buyers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Buyer</Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>GSTIN</TableCell>
                <TableCell>Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : buyers?.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No buyers found.</TableCell></TableRow>
              ) : (
                buyers?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.mobile || 'N/A'}</TableCell>
                    <TableCell>{row.gstNumber || 'N/A'}</TableCell>
                    <TableCell>{row.commissionRate}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <BuyerForm open={open} onClose={() => setOpen(false)} onSubmit={(data: any) => createMutation.mutate(data, { onSuccess: () => setOpen(false) })} isLoading={createMutation.isPending} />
    </Box>
  );
};
