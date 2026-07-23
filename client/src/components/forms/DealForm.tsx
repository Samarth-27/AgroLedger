import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DealSchema } from '@mandi-erp/shared';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress, Autocomplete } from '@mui/material';
import { useArrivals } from '@hooks/useTransactions';
import { useBuyers } from '@hooks/useMasters';

export const DealForm = ({ open, onClose, onSubmit, isLoading }: any) => {
  const { data: arrivals = [] } = useArrivals();
  const { data: buyers = [] } = useBuyers();
  
  // Filter only pending arrivals
  const pendingArrivals = arrivals.filter((a: any) => a.status === 'PENDING');

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(DealSchema as any),
    defaultValues: { arrivalId: '', buyerId: '', rate: 0, date: new Date().toISOString().split('T')[0] }
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Create Deal (Auction)</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            
            <Controller name="arrivalId" control={control} render={({ field: { onChange } }) => (
              <Autocomplete
                options={pendingArrivals}
                getOptionLabel={(option: any) => `${option.arrivalNumber} - ${option.farmer?.name} (${option.commodity?.name})`}
                onChange={(_, data) => onChange(data?._id || '')}
                renderInput={(params) => <TextField {...params} label="Select Pending Arrival" error={!!errors.arrivalId} helperText={errors.arrivalId?.message as string} />}
              />
            )} />

            <Controller name="buyerId" control={control} render={({ field: { onChange } }) => (
              <Autocomplete
                options={buyers}
                getOptionLabel={(option: any) => `${option.code} - ${option.name}`}
                onChange={(_, data) => onChange(data?._id || '')}
                renderInput={(params) => <TextField {...params} label="Select Winning Buyer" error={!!errors.buyerId} helperText={errors.buyerId?.message as string} />}
              />
            )} />

            <Controller name="rate" control={control} render={({ field }) => (
              <TextField {...field} type="number" inputProps={{ step: '0.01' }} label="Auction Rate (₹/Qtl)" fullWidth error={!!errors.rate} helperText={errors.rate?.message as string} 
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            )} />
            
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />}>Confirm Deal</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
