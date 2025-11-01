import mongoose from "mongoose";

import { User as UserSchema } from "@expensegenie/proto-gen";

const userSchema = new mongoose.Schema<UserSchema>(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    profilePic: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserSchema>("User", userSchema);
