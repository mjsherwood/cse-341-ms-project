import mongoose, { Document, Schema } from 'mongoose';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  // You can add more roles as needed
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(UserRole) }, // Utilizing UserRole enum
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field on save and set created_at if it doesn't exist
UserSchema.pre('save', function (next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  this.updated_at = new Date();
  next();
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;