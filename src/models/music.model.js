import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    statusCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StatusCategory",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // in sec
      required: true,
    },
    musicFile: {
      type: String,
      required: true,
    },
    isFree: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Music", musicSchema);
