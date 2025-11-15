import mongoose from "mongoose";

const audioPlayBackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // in sec
      default: 0,
    },
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    default: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDashboard: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("audioPlayback", audioPlayBackSchema);
