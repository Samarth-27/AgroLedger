import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDashboardSummary } from '@hooks/useDashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard = () => {
  const { data, isLoading, error } = useDashboardSummary();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load dashboard data.</Typography>
      </Box>
    );
  }

  const { metrics, charts, recentDeals } = data;
  const pieData = charts?.arrivalsByCommodity || [];

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Outfit', fontWeight: 700, color: 'text.primary' }}>
        Dashboard Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
            color: 'white', 
            boxShadow: '0 10px 20px -10px rgba(99,102,241,0.6)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgba(99,102,241,0.4)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
              <LocalShippingIcon sx={{ fontSize: 48, opacity: 0.9 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9, letterSpacing: 1, textTransform: 'uppercase' }}>Today's Arrivals</Typography>
                <Typography variant="h3" fontWeight="700" sx={{ mt: 1 }}>
                  {metrics.dailyArrivalsCount} <Typography component="span" variant="h6" sx={{ opacity: 0.8 }}>({metrics.dailyArrivalsWeight} Qtl)</Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`, 
            color: 'white', 
            boxShadow: '0 10px 20px -10px rgba(236,72,153,0.6)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgba(236,72,153,0.4)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
              <GavelIcon sx={{ fontSize: 48, opacity: 0.9 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9, letterSpacing: 1, textTransform: 'uppercase' }}>Today's Deals</Typography>
                <Typography variant="h3" fontWeight="700" sx={{ mt: 1 }}>{metrics.dailyDealsCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`, 
            color: 'white', 
            boxShadow: '0 10px 20px -10px rgba(245,158,11,0.6)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgba(245,158,11,0.4)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
              <ReceiptLongIcon sx={{ fontSize: 48, opacity: 0.9 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.9, letterSpacing: 1, textTransform: 'uppercase' }}>Unpaid Bills</Typography>
                <Typography variant="h3" fontWeight="700" sx={{ mt: 1 }}>
                  {metrics.unpaidJFormsCount} <Typography component="span" variant="h6" sx={{ opacity: 0.8 }}>(₹{metrics.unpaidJFormsValue.toLocaleString('en-IN')})</Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Chart Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Arrivals by Commodity</Typography>
            <Divider sx={{ mb: 3 }} />
            {pieData.length === 0 ? (
              <Box sx={{ display: 'flex', height: 250, alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No arrivals data available.</Typography>
              </Box>
            ) : (
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {pieData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => `${value} Qtl`} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Deals Table Section */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Recent Auctions/Deals</Typography>
            <Divider sx={{ mb: 3 }} />
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Deal No</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell>Commodity</TableCell>
                    <TableCell align="right">Rate (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentDeals?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>No recent deals.</TableCell></TableRow>
                  ) : (
                    recentDeals?.map((deal: any) => (
                      <TableRow hover key={deal._id} sx={{ transition: 'background-color 0.2s' }}>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{deal.dealNumber}</TableCell>
                        <TableCell>{format(new Date(deal.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{deal.buyer || 'Unknown'}</TableCell>
                        <TableCell>{deal.commodity || 'Unknown'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                          ₹{deal.rate}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
