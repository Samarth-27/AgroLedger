
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { Layout } from '@components/Layout';
import { Dashboard } from '@pages/Dashboard';
import { FarmerList } from '@pages/masters/FarmerList';
import { BuyerList } from '@pages/masters/BuyerList';
import { CommodityList } from '@pages/masters/CommodityList';
import { GodownList } from '@pages/masters/GodownList';
import { BrokerList, TransportList, VehicleList, LabourList, ExpenseCategoryList, AccountHeadList, BankList, FinancialYearList, SystemSettingList } from '@pages/masters/ExtendedMasters';
import { ArrivalList } from '@pages/transactions/ArrivalList';
import { DealList } from '@pages/transactions/DealList';
import { JFormList } from '@pages/billing/JFormList';
import { BuyerInvoiceList } from '@pages/billing/BuyerInvoiceList';
import { PaymentReceiptList } from '@pages/billing/PaymentReceiptList';
import { TrialBalance } from '@pages/accounting/TrialBalance';
import { LedgerView } from '@pages/accounting/LedgerView';
import { Settings } from '@pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="farmers" element={<FarmerList />} />
                  <Route path="buyers" element={<BuyerList />} />
                  <Route path="commodities" element={<CommodityList />} />
                  <Route path="godowns" element={<GodownList />} />
                  <Route path="brokers" element={<BrokerList />} />
                  <Route path="transports" element={<TransportList />} />
                  <Route path="vehicles" element={<VehicleList />} />
                  <Route path="labours" element={<LabourList />} />
                  <Route path="expense-categories" element={<ExpenseCategoryList />} />
                  <Route path="account-heads" element={<AccountHeadList />} />
                  <Route path="banks" element={<BankList />} />
                  <Route path="financial-years" element={<FinancialYearList />} />
                  <Route path="settings" element={<SystemSettingList />} />
                  <Route path="arrivals" element={<ArrivalList />} />
                  <Route path="deals" element={<DealList />} />
                  <Route path="jforms" element={<JFormList />} />
                  <Route path="invoices" element={<BuyerInvoiceList />} />
                  <Route path="payments" element={<PaymentReceiptList />} />
                  <Route path="accounting">
                    <Route path="trial-balance" element={<TrialBalance />} />
                    <Route path="ledger" element={<LedgerView />} />
                  </Route>
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
