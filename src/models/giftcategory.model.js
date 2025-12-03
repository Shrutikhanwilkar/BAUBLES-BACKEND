import mongoose from "mongoose";

const giftCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    packageType: {
      type: String,
      // enum: [
      //   "Exclusive First-Open",
      //   "Holiday Peak",
      //   "Targeted Age",
      //   "Basic",
      //   "Short-Term Burst",
      // ],
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    minAge: { type: Number, default: null },
    maxAge: { type: Number, default: null },

    isWeekendOnly: { type: Boolean, default: false },

    priority: { type: Number, default: 999 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GiftCategory", giftCategorySchema);
