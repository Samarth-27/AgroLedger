
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommoditySchema, ICommodity } from '@mandi-erp/shared';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';

export const CommodityForm = ({ open, onClose, onSubmit, isLoading }: any) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ICommodity>({
    resolver: zodResolver(CommoditySchema as any),
    defaultValues: { name: '', hindiName: '', hsnCode: '', mandiTaxRate: 0, kkfRate: 0, cgst: 0, sgst: 0 }
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Commodity</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} label="Name (English)" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )} />
              <Controller name="hindiName" control={control} render={({ field }) => (
                <TextField {...field} label="Name (Hindi)" fullWidth />
              )} />
            </Box>
            <Controller name="hsnCode" control={control} render={({ field }) => (
              <TextField {...field} label="HSN Code" fullWidth />
            )} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="mandiTaxRate" control={control} render={({ field }) => (
                <TextField {...field} type="number" label="Mandi Tax (%)" fullWidth />
              )} />
              <Controller name="kkfRate" control={control} render={({ field }) => (
                <TextField {...field} type="number" label="KKF Tax (%)" fullWidth />
              )} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="cgst" control={control} render={({ field }) => (
                <TextField {...field} type="number" label="CGST (%)" fullWidth />
              )} />
              <Controller name="sgst" control={control} render={({ field }) => (
                <TextField {...field} type="number" label="SGST (%)" fullWidth />
              )} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />}>Save Commodity</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
