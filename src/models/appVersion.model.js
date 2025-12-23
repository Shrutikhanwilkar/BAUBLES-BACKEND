import mongoose from "mongoose";

const appVersionSchema = new mongoose.Schema(
  {
    androidVersion: { type: String, required: true }, // e.g., "1.0.3"
    iosVersion: { type: String, required: true }, // e.g., "1.0.5"
    isForceUpdate: { type: Boolean, default: false }, // Applies to both platforms
    notes: { type: String }, // Description / update message
    releaseDate: { type: Date, default: Date.now }, // Auto timestamp
  },
  { timestamps: true }
);

export default mongoose.model("AppVersion", appVersionSchema);
