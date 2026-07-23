import { Box, Typography, Grid, Paper, Card, CardContent, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDashboardSummary } from '@hooks/useDashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard = () => {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
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
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Dashboard Overview</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalShippingIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="h6">Today's Arrivals</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {metrics.dailyArrivalsCount} <Typography component="span" variant="body1">({metrics.dailyArrivalsWeight} Qtl)</Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GavelIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="h6">Today's Deals</Typography>
                <Typography variant="h4" fontWeight="bold">{metrics.dailyDealsCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText', boxShadow: 3 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ReceiptLongIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              <Box>
                <Typography variant="h6">Unpaid Bills (J-Forms)</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {metrics.unpaidJFormsCount} <Typography component="span" variant="body1">(₹{metrics.unpaidJFormsValue.toLocaleString('en-IN')})</Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Chart Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Arrivals by Commodity (Total Qtl)</Typography>
            <Divider sx={{ mb: 2 }} />
            {pieData.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ mt: 10 }}>No arrivals data available.</Typography>
            ) : (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                    >
                      {pieData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `${value} Qtl`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Deals Table Section */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Auctions/Deals</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
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
                    <TableRow><TableCell colSpan={5} align="center">No recent deals.</TableCell></TableRow>
                  ) : (
                    recentDeals?.map((deal: any) => (
                      <TableRow hover key={deal._id}>
                        <TableCell sx={{ fontWeight: 500 }}>{deal.dealNumber}</TableCell>
                        <TableCell>{format(new Date(deal.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell>{deal.buyer || 'Unknown'}</TableCell>
                        <TableCell>{deal.commodity || 'Unknown'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
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
