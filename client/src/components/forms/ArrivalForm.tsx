import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrivalSchema } from '@mandi-erp/shared';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress, Autocomplete } from '@mui/material';
import { useFarmers, useCommodities } from '@hooks/useMasters';

export const ArrivalForm = ({ open, onClose, onSubmit, isLoading }: any) => {
  const { data: farmers = [] } = useFarmers();
  const { data: commodities = [] } = useCommodities();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ArrivalSchema as any),
    defaultValues: { farmerId: '', commodityId: '', bags: 0, weight: 0, date: new Date().toISOString().split('T')[0] }
  });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Register Arrival</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            
            <Controller name="farmerId" control={control} render={({ field: { onChange } }) => (
              <Autocomplete
                options={farmers}
                getOptionLabel={(option: any) => `${option.code} - ${option.name}`}
                onChange={(_, data) => onChange(data?._id || '')}
                renderInput={(params) => <TextField {...params} label="Select Farmer" error={!!errors.farmerId} helperText={errors.farmerId?.message as string} />}
              />
            )} />

            <Controller name="commodityId" control={control} render={({ field: { onChange } }) => (
              <Autocomplete
                options={commodities}
                getOptionLabel={(option: any) => option.name}
                onChange={(_, data) => onChange(data?._id || '')}
                renderInput={(params) => <TextField {...params} label="Select Commodity" error={!!errors.commodityId} helperText={errors.commodityId?.message as string} />}
              />
            )} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="bags" control={control} render={({ field }) => (
                <TextField {...field} type="number" label="Total Bags" fullWidth error={!!errors.bags} helperText={errors.bags?.message as string} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )} />
              <Controller name="weight" control={control} render={({ field }) => (
                <TextField {...field} type="number" inputProps={{ step: '0.01' }} label="Weight (Quintals)" fullWidth error={!!errors.weight} helperText={errors.weight?.message as string} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )} />
            </Box>
            
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />}>Save Arrival</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
