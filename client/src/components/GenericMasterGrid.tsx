import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'boolean';
  options?: string[]; // for select dropdowns
  hideInForm?: boolean;
}

export const GenericMasterGrid = ({ title, columns, hooks, schema }: { title: string, columns: ColumnDef[], hooks: any, schema: any }) => {
  const { data, isLoading } = hooks.useGetAll();
  const createMutation = hooks.useCreate();
  const deleteMutation = hooks.useDelete();
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{title}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { reset(); setOpen(true); }}>
          Add {title}
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(col => <TableCell key={col.key}>{col.label}</TableCell>)}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>No records found.</TableCell>
                </TableRow>
              ) : (
                data?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    {columns.map(col => (
                      <TableCell key={col.key}>{row[col.key]?.toString()}</TableCell>
                    ))}
                    <TableCell align="right">
                      <Button color="error" size="small" onClick={() => handleDelete(row._id)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dynamic Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add New {title}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {columns.filter(c => !c.hideInForm).map(col => (
              <Controller
                key={col.key}
                name={col.key}
                control={control}
                render={({ field }: any) => {
                  if (col.type === 'select') {
                    return (
                      <TextField
                        {...field}
                        select
                        label={col.label}
                        error={!!errors[col.key]}
                        helperText={errors[col.key]?.message as string}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        {col.options?.map(opt => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    );
                  }
                  
                  if (col.type === 'boolean') {
                    return (
                      <TextField
                        {...field}
                        select
                        label={col.label}
                        error={!!errors[col.key]}
                        helperText={errors[col.key]?.message as string}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                         <MenuItem value="true">Yes</MenuItem>
                         <MenuItem value="false">No</MenuItem>
                      </TextField>
                    );
                  }

                  return (
                    <TextField
                      {...field}
                      type={col.type === 'number' ? 'number' : 'text'}
                      label={col.label}
                      error={!!errors[col.key]}
                      helperText={errors[col.key]?.message as string}
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  );
                }}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
