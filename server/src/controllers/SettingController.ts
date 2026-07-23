import { Request, Response, NextFunction } from 'express';
import { settingService } from '../services/SettingService';

export class SettingController {
  async getAllSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingService.getAllSettings();
      res.json({ success: true, data: settings, message: 'Settings retrieved successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const updatedSetting = await settingService.updateSetting(key, value);
      res.json({ success: true, data: updatedSetting, message: 'Setting updated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const settingController = new SettingController();
