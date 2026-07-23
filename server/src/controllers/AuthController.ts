import { Request, Response, NextFunction } from 'express';
import { authService } from '@services/AuthService';
import { LoginSchema } from '@mandi-erp/shared';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = LoginSchema.parse(req.body);
      const result = await authService.login(validated);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
