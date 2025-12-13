import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
    activeUserCount: { type: Number, default: 0 },
    body: { type: String, default: null },
    title: { type: String, default: null },
    type: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("broadcast", broadcastSchema);
