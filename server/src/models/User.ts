import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  role: string;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Operator'], default: 'Operator' }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserDocument>('User', UserSchema);
