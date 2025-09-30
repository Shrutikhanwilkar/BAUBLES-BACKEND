import mongoose from "mongoose";
import { Role } from "../utils/constants.js"
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: null,
    },
    role: { type: String, required: true, default: Role.USER },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String},
    otpExpiredAt: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
