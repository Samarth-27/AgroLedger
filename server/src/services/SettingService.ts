import { SystemSetting } from '../models/SystemSetting';

export class SettingService {
  private defaultSettings = [
    { key: 'FIRM_NAME', value: 'Jain & Jain Trading Co.', description: 'Name of the firm for print documents' },
    { key: 'GSTIN', value: '07AAECJ1234F1Z5', description: 'Firm GSTIN' },
    { key: 'ADDRESS', value: 'Shop 42, New Anaj Mandi', description: 'Firm Address' },
    { key: 'PALLEDARI_RATE_PER_BAG', value: 5.0, description: 'Default Palledari charge per bag' },
    { key: 'HAMALI_RATE_PER_BAG', value: 2.0, description: 'Default Hamali charge per bag' },
    { key: 'TULAI_RATE_PER_BAG', value: 1.5, description: 'Default Tulai charge per bag' },
  ];

  async seedDefaults() {
    for (const setting of this.defaultSettings) {
      const exists = await SystemSetting.findOne({ key: setting.key });
      if (!exists) {
        await SystemSetting.create(setting);
      }
    }
  }

  async getAllSettings() {
    return await SystemSetting.find().sort({ key: 1 });
  }

  async getSetting(key: string) {
    const setting = await SystemSetting.findOne({ key });
    if (setting) return setting.value;
    
    const def = this.defaultSettings.find(s => s.key === key);
    return def ? def.value : null;
  }

  async updateSetting(key: string, value: any) {
    return await SystemSetting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
  }
}

export const settingService = new SettingService();
