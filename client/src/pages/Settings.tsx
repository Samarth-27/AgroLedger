import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { useSettings, useUpdateSetting } from '@hooks/useSettings';
import SaveIcon from '@mui/icons-material/Save';

export const Settings = () => {
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (settings) {
      const settingsMap: Record<string, any> = {};
      settings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    try {
      setSaveStatus(null);
      // Attempt to parse numbers automatically
      let valToSave = localSettings[key];
      if (!isNaN(Number(valToSave)) && valToSave !== '') {
        valToSave = Number(valToSave);
      }
      
      await updateSetting.mutateAsync({ key, value: valToSave });
      setSaveStatus({ type: 'success', message: `${key} updated successfully` });
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update setting' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">System Settings</Typography>
      </Box>

      {saveStatus && (
        <Alert severity={saveStatus.type} sx={{ mb: 3 }}>
          {saveStatus.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {settings?.map((setting) => (
          <Grid item xs={12} md={6} key={setting.key}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">{setting.key.replace(/_/g, ' ')}</Typography>
              <Typography variant="body2" color="textSecondary">{setting.description}</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: 1 }}>
                <TextField 
                  fullWidth
                  size="small"
                  value={localSettings[setting.key] !== undefined ? localSettings[setting.key] : ''}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                />
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave(setting.key)}
                  disabled={updateSetting.isPending}
                >
                  Save
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
