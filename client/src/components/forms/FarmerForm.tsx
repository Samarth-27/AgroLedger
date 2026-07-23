
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FarmerSchema, IFarmer } from '@mandi-erp/shared';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Box, CircularProgress
} from '@mui/material';

interface FarmerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IFarmer) => void;
  isLoading: boolean;
}

export const FarmerForm: React.FC<FarmerFormProps> = ({ open, onClose, onSubmit, isLoading }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<IFarmer>({
    resolver: zodResolver(FarmerSchema as any),
    defaultValues: {
      name: '', fatherName: '', mobile: '', village: '',
      bankDetails: { accountNo: '', ifsc: '', bankName: '' }
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Farmer</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller name="name" control={control} render={({ field }) => (
              <TextField {...field} label="Farmer Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
            )} />
            <Controller name="fatherName" control={control} render={({ field }) => (
              <TextField {...field} label="Father Name" fullWidth error={!!errors.fatherName} helperText={errors.fatherName?.message} />
            )} />
            <Controller name="mobile" control={control} render={({ field }) => (
              <TextField {...field} label="Mobile" fullWidth error={!!errors.mobile} helperText={errors.mobile?.message} />
            )} />
            <Controller name="village" control={control} render={({ field }) => (
              <TextField {...field} label="Village" fullWidth error={!!errors.village} helperText={errors.village?.message} />
            )} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller name="bankDetails.bankName" control={control} render={({ field }) => (
                <TextField {...field} label="Bank Name" fullWidth />
              )} />
              <Controller name="bankDetails.accountNo" control={control} render={({ field }) => (
                <TextField {...field} label="Account No" fullWidth />
              )} />
              <Controller name="bankDetails.ifsc" control={control} render={({ field }) => (
                <TextField {...field} label="IFSC Code" fullWidth />
              )} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />}>
            Save Farmer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
