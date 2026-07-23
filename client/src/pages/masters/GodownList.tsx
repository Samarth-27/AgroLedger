import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGodowns, useCreateGodown } from '@hooks/useMasters';
import { GodownForm } from '@components/forms/GodownForm';

export const GodownList = () => {
  const { data: godowns, isLoading } = useGodowns();
  const createMutation = useCreateGodown();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Godowns</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Godown</Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Capacity (Quintals)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : godowns?.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}>No godowns found.</TableCell></TableRow>
              ) : (
                godowns?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.location || 'N/A'}</TableCell>
                    <TableCell>{row.capacity}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <GodownForm open={open} onClose={() => setOpen(false)} onSubmit={(data: any) => createMutation.mutate(data, { onSuccess: () => setOpen(false) })} isLoading={createMutation.isPending} />
    </Box>
  );
};
