import mongoose from "mongoose";

const broadcastSchema = new mongoose.Schema(
  {
   
    activeUserCount: { type: Number,default:0 },

   
  },
  { timestamps: true }
);

export default mongoose.model("broadcast", broadcastSchema);
