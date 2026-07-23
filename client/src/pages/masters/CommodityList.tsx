import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useCommodities, useCreateCommodity } from '@hooks/useMasters';
import { CommodityForm } from '@components/forms/CommodityForm';

export const CommodityList = () => {
  const { data: commodities, isLoading } = useCommodities();
  const createMutation = useCreateCommodity();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Commodities</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Commodity</Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name (En)</TableCell>
                <TableCell>Name (Hi)</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell>Mandi Tax</TableCell>
                <TableCell>KKF</TableCell>
                <TableCell>CGST</TableCell>
                <TableCell>SGST</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : commodities?.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}>No commodities found.</TableCell></TableRow>
              ) : (
                commodities?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.hindiName || 'N/A'}</TableCell>
                    <TableCell>{row.hsnCode || 'N/A'}</TableCell>
                    <TableCell>{row.mandiTaxRate}%</TableCell>
                    <TableCell>{row.kkfRate}%</TableCell>
                    <TableCell>{row.cgst}%</TableCell>
                    <TableCell>{row.sgst}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CommodityForm open={open} onClose={() => setOpen(false)} onSubmit={(data: any) => createMutation.mutate(data, { onSuccess: () => setOpen(false) })} isLoading={createMutation.isPending} />
    </Box>
  );
};
