import { useState, useRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Chip, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useJForms } from '@hooks/useBilling';
import { format } from 'date-fns';
import { PrintJFormTemplate } from '@components/print/PrintJFormTemplate';

export const JFormList = () => {
  const { data: jForms, isLoading } = useJForms();
  const [selectedJForm, setSelectedJForm] = useState<any>(null);
  
  const printRef = useRef<HTMLDivElement>(null);

  const onPrintClick = (jForm: any) => {
    setSelectedJForm(jForm);
    // Give state time to update and render the hidden template
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">J-Forms (Farmer Bills)</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>J-Form No.</TableCell>
                <TableCell>Deal No.</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Gross Amt (₹)</TableCell>
                <TableCell>Deductions (₹)</TableCell>
                <TableCell>Net Payable (₹)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : jForms?.length === 0 ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 3 }}>No J-Forms generated yet.</TableCell></TableRow>
              ) : (
                jForms?.map((row: any) => {
                  const deductions = (row.commissionExpense || 0) + (row.palledari || 0) + (row.hamali || 0) + (row.tulai || 0) + (row.kkf || 0) + (row.mandiTax || 0) + (row.labourExpense || 0);
                  return (
                    <TableRow hover key={row._id}>
                      <TableCell>{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{row.jFormNumber}</TableCell>
                      <TableCell>{row.deal?.dealNumber}</TableCell>
                      <TableCell>{row.farmer?.name}</TableCell>
                      <TableCell>₹{row.grossAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell sx={{ color: 'error.main' }}>-₹{deductions.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'success.main', fontSize: '1.1rem' }}>
                        ₹{row.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={row.status === 'PAID' ? 'success' : 'warning'} 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Print Bill">
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

      {/* Hidden print template */}
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
        {selectedJForm && <PrintJFormTemplate ref={printRef} jForm={selectedJForm} />}
      </Box>
    </Box>
  );
};
