import { forwardRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';

export const PrintJFormTemplate = forwardRef<HTMLDivElement, { jForm: any }>(({ jForm }, ref) => {
  if (!jForm) return null;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">JAIN & JAIN MANDI ERP</Typography>
        <Typography variant="subtitle1">Commission Agent & Adhat Business</Typography>
        <Typography variant="body2">123 Mandi Road, Agricultural Market, State</Typography>
        <Typography variant="h5" sx={{ mt: 2, textDecoration: 'underline' }}>J-FORM (FARMER SETTLEMENT)</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="body1"><strong>Farmer Name:</strong> {jForm.farmer?.name}</Typography>
          <Typography variant="body1"><strong>Farmer Code:</strong> {jForm.farmer?.code}</Typography>
          <Typography variant="body1"><strong>Commodity:</strong> {jForm.deal?.arrival?.commodity?.name}</Typography>
        </Box>
        <Box>
          <Typography variant="body1"><strong>J-Form No:</strong> {jForm.jFormNumber}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {new Date(jForm.date).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>Rate:</strong> ₹{jForm.deal?.rate} / Qtl</Typography>
          <Typography variant="body1"><strong>Weight:</strong> {jForm.deal?.arrival?.weight} Qtl</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Table size="small" sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Gross Sales Amount</TableCell>
            <TableCell align="right">{jForm.grossAmount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: Commission (Adhat)</TableCell>
            <TableCell align="right">- {jForm.commissionExpense}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: Palledari</TableCell>
            <TableCell align="right">- {jForm.palledari || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: Hamali</TableCell>
            <TableCell align="right">- {jForm.hamali || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: Tulai</TableCell>
            <TableCell align="right">- {jForm.tulai || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: KKF</TableCell>
            <TableCell align="right">- {jForm.kkf || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: Mandi Tax</TableCell>
            <TableCell align="right">- {jForm.mandiTax || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Less: Other Labour Charges</TableCell>
            <TableCell align="right">- {jForm.labourExpense || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>Net Payable Amount</strong></TableCell>
            <TableCell align="right"><strong>{jForm.netAmount}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1">Farmer Signature</Typography>
        <Typography variant="body1">Authorized Signatory</Typography>
      </Box>
    </Box>
  );
});
