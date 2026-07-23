import mongoose, { Schema, Document } from 'mongoose';
import { ISystemSetting } from '@mandi-erp/shared';

export interface ISystemSettingDocument extends Omit<ISystemSetting, '_id'>, Document {}

const SystemSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.model<ISystemSettingDocument>('SystemSetting', SystemSettingSchema);
