// import mongoose, { Document, Schema } from 'mongoose';
// enum UserRole {
//   ADMIN = 'ADMIN',
//   USER = 'USER',
// }
// interface IUser extends Document {
//   username: string;
//   email: string;
//   password: string;
//   role: UserRole;
// }
// const UserSchema: Schema = new Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true, enum: Object.values(UserRole) }
// });
// UserSchema.pre('save', function (next) {
//   if (!this.created_at) {
//     this.created_at = new Date();
//   }
//   this.updated_at = new Date();
//   next();
// });
// const User = mongoose.model<IUser>('User', UserSchema);
// export default User;
