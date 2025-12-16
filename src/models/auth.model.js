import mongoose from "mongoose";
import { Role } from "../utils/constants.js";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, unique: true },
    countryCode: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
    role: { type: String, required: true, default: Role.USER },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiredAt: { type: Number },
    deviceToken: { type: String, default: null },
    deviceType: { type: String, default: null },
    isFirstAppOpen: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    isDeactived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
