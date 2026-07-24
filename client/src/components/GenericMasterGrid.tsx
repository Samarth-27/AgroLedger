import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  const updateMutation = hooks.useUpdate();
  const deleteMutation = hooks.useDelete();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleOpenNew = () => {
    reset();
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (record: any) => {
    reset();
    setEditingId(record._id);
    Object.keys(record).forEach((key) => {
      if (key !== '_id') {
        setValue(key, record[key]?.toString() || '');
      }
    });
    setOpen(true);
  };

  const onSubmit = (formData: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData }, {
        onSuccess: () => {
          setOpen(false);
          setEditingId(null);
          reset();
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setOpen(false);
          reset();
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>{title}s</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew} sx={{ borderRadius: 2 }}>
          Add {title}
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
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
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 5, color: 'text.secondary' }}>No records found.</TableCell>
                </TableRow>
              ) : (
                data?.map((row: any) => (
                  <TableRow hover key={row._id}>
                    {columns.map(col => (
                      <TableCell key={col.key}>{row[col.key]?.toString()}</TableCell>
                    ))}
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="primary" size="small" onClick={() => handleEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" size="small" onClick={() => handleDelete(row._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dynamic Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
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
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
