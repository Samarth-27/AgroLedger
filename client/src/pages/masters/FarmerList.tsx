import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFarmers, useCreateFarmer } from '@hooks/useMasters';
import { FarmerForm } from '@components/forms/FarmerForm';
import { IFarmer } from '@mandi-erp/shared';

export const FarmerList = () => {
  const { data: farmers, isLoading } = useFarmers();
  const createMutation = useCreateFarmer();
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: IFarmer) => {
    createMutation.mutate(data, {
      onSuccess: () => setOpen(false)
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Farmers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Farmer
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Father Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Village</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell>
                </TableRow>
              ) : farmers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>No farmers found.</TableCell>
                </TableRow>
              ) : (
                farmers?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.fatherName}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.village}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FarmerForm open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </Box>
  );
};
