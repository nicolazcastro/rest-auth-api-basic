import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  userId: number;
  password: string;
  profile: string;
  emailConfirmed: boolean;
  emailConfirmationToken?: string;
  emailConfirmationExpires?: Date;
  accessTypes?: string[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface INewUserEntry {
  name: string;
  email: string;
  userId: number;
  password: string;
  profile: string;
  emailConfirmed?: boolean;
  emailConfirmationToken?: string;
  emailConfirmationExpires?: Date;
  accessTypes?: string[];
  passwordResetToken?: string;
  passwordResetExpires?: string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: Number, required: true },
  password: { type: String, required: true },
  profile: { type: String, required: true },
  emailConfirmed: { type: Boolean, default: false },
  emailConfirmationToken: { type: String },
  emailConfirmationExpires: { type: Date },
  accessTypes: { type: [String], default: [] },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

export default mongoose.model<IUser>('User', userSchema);