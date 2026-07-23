import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, Divider, ListSubheader } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import BalanceIcon from '@mui/icons-material/Balance';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'Main Transactions',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Arrivals', icon: <LocalShippingIcon />, path: '/arrivals' },
        { text: 'Deals/Auctions', icon: <GavelIcon />, path: '/deals' },
        { text: 'J-Forms (Bills)', icon: <ReceiptLongIcon />, path: '/jforms' },
        { text: 'Buyer Invoices', icon: <ReceiptLongIcon />, path: '/invoices' },
        { text: 'Payments & Receipts', icon: <PaymentIcon />, path: '/payments' },
        { text: 'Trial Balance', icon: <BalanceIcon />, path: '/accounting/trial-balance' },
      ]
    },
    {
      title: 'Master Data & Setup',
      items: [
        { text: 'Farmers', icon: <PeopleAltIcon />, path: '/farmers' },
        { text: 'Buyers', icon: <StorefrontIcon />, path: '/buyers' },
        { text: 'Commodities', icon: <Inventory2Icon />, path: '/commodities' },
        { text: 'Brokers', icon: <PersonIcon />, path: '/brokers' },
        { text: 'Transports', icon: <LocalShippingIcon />, path: '/transports' },
        { text: 'Vehicles', icon: <LocalShippingIcon />, path: '/vehicles' },
        { text: 'Godowns', icon: <WarehouseIcon />, path: '/godowns' },
        { text: 'Labours', icon: <PeopleAltIcon />, path: '/labours' },
        { text: 'Expense Cats', icon: <CategoryIcon />, path: '/expense-categories' },
        { text: 'Account Heads', icon: <AccountBalanceIcon />, path: '/account-heads' },
        { text: 'Banks', icon: <AccountBalanceIcon />, path: '/banks' },
      ]
    },
    {
      title: 'System',
      items: [
        { text: 'Financial Years', icon: <SettingsIcon />, path: '/financial-years' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
      ]
    }
  ];

  const renderMenuItem = (item: any) => (
    <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 2 }}>
      <ListItemButton
        onClick={() => navigate(item.path)}
        selected={location.pathname === item.path}
        sx={{
          borderRadius: 2,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.contrastText',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            Mandi ERP
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{user?.email}</Typography>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, px: 2 }}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="button">Logout</Typography>
            </ListItemButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2, pb: 2 }}>
          {menuGroups.map((group, index) => (
            <Box key={group.title}>
              <List
                subheader={
                  <ListSubheader 
                    component="div" 
                    sx={{ 
                      backgroundColor: 'transparent', 
                      lineHeight: '32px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'text.secondary'
                    }}
                  >
                    {group.title}
                  </ListSubheader>
                }
              >
                {group.items.map(renderMenuItem)}
              </List>
              {index < menuGroups.length - 1 && <Divider sx={{ my: 1, mx: 2, borderColor: 'rgba(255,255,255,0.1)' }} />}
            </Box>
          ))}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
