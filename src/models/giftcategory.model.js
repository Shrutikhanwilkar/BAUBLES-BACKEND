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
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minAge: { type: Number, default: null },
    maxAge: { type: Number, default: null },
    isTargetedAgeOnly: { type: Boolean, default: false },
    isExclusiveFirstAppOpen: { type: Boolean, default: false },
    isWeekendOnly: { type: Boolean, default: false },
    isHoliday:{type: Boolean, default: false},
    isBasic:{type: Boolean, default: false},
    priority: { type: Number, default: 999 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GiftCategory", giftCategorySchema);
