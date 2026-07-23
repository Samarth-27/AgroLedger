import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { ILoginRequest } from '@mandi-erp/shared';

export class AuthService {
  async login(payload: ILoginRequest) {
    const { email, password } = payload;
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    };
  }

  // Ensures an admin account exists for testing
  async seedAdmin() {
    const adminExists = await User.findOne({ email: 'admin@mandierp.com' });
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@mandierp.com',
        passwordHash,
        role: 'Admin'
      });
      console.log('Seeded default admin account: admin@mandierp.com / admin123');
    }
  }
}

export const authService = new AuthService();
