import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const staticPageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
staticPageSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
const StaticPage = mongoose.model("StaticPage", staticPageSchema);

export default StaticPage;
