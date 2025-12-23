import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GiftCategory",
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    productLink: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Gift", giftSchema);
