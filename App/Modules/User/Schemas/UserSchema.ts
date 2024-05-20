import mongoose, { Document, Schema } from "mongoose";
import { User } from "../Models/User";
import bcrypt from "bcrypt";

const ObjectId = mongoose.Schema.Types.ObjectId;
export type UserDocument = Document & User;

const userSchema = new Schema<UserDocument>(
  {
    userName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: ObjectId, ref: "Role", required: true }],
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre<UserDocument>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

const UserSchema = mongoose.model<UserDocument>("User", userSchema);

export default UserSchema;
