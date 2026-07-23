
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GodownSchema, IGodown } from '@mandi-erp/shared';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';

export const GodownForm = ({ open, onClose, onSubmit, isLoading }: any) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IGodown>({
    resolver: zodResolver(GodownSchema as any),
    defaultValues: { name: '', location: '', capacity: 0 }
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Godown</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller name="name" control={control} render={({ field }) => (
              <TextField {...field} label="Godown Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
            )} />
            <Controller name="location" control={control} render={({ field }) => (
              <TextField {...field} label="Location" fullWidth />
            )} />
            <Controller name="capacity" control={control} render={({ field }) => (
              <TextField {...field} type="number" label="Capacity (Quintals)" fullWidth />
            )} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />}>Save Godown</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
