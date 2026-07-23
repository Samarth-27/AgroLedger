
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuyerSchema, IBuyer } from '@mandi-erp/shared';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';

export const BuyerForm = ({ open, onClose, onSubmit, isLoading }: any) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IBuyer>({
    resolver: zodResolver(BuyerSchema as any),
    defaultValues: { name: '', mobile: '', gstNumber: '', panNumber: '', address: '', commissionRate: 0 }
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Buyer</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller name="name" control={control} render={({ field }) => (
              <TextField {...field} label="Firm Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
            )} />
            <Controller name="address" control={control} render={({ field }) => (
              <TextField {...field} label="Address" fullWidth error={!!errors.address} helperText={errors.address?.message} />
            )} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="mobile" control={control} render={({ field }) => (
                <TextField {...field} label="Mobile" fullWidth error={!!errors.mobile} helperText={errors.mobile?.message} />
              )} />
              <Controller name="commissionRate" control={control} render={({ field }) => (
                <TextField {...field} type="number" label="Commission (%)" fullWidth error={!!errors.commissionRate} helperText={errors.commissionRate?.message} />
              )} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="gstNumber" control={control} render={({ field }) => (
                <TextField {...field} label="GSTIN" fullWidth error={!!errors.gstNumber} helperText={errors.gstNumber?.message} />
              )} />
              <Controller name="panNumber" control={control} render={({ field }) => (
                <TextField {...field} label="PAN" fullWidth error={!!errors.panNumber} helperText={errors.panNumber?.message} />
              )} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />}>Save Buyer</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
