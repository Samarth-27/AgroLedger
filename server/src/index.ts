import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from '@utils/logger';
import { errorHandler } from '@middlewares/errorHandler';
import { setupSwagger } from '@utils/swagger';
import { masterRoutes } from '@routes/masterRoutes';
import { transactionRoutes } from '@routes/transactionRoutes';
import { billingRoutes } from '@routes/billingRoutes';
import { dashboardRoutes } from '@routes/dashboardRoutes';
import { ledgerRoutes } from '@routes/ledgerRoutes';
import { settingRoutes } from '@routes/settingRoutes';
import { authRoutes } from '@routes/authRoutes';
import { authMiddleware } from '@middlewares/authMiddleware';
import { authService } from '@services/AuthService';
import { settingService } from '@services/SettingService';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger Documentation
setupSwagger(app);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

// Auth Route (Public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/masters', authMiddleware, masterRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/billing', authMiddleware, billingRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/accounting', authMiddleware, ledgerRoutes);
app.use('/api/settings', authMiddleware, settingRoutes);

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mandi-erp')
  .then(async () => {
    console.log('Connected to MongoDB');
    await authService.seedAdmin(); // Seed default admin account
    await settingService.seedDefaults(); // Seed default settings
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
