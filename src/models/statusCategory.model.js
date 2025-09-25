import mongoose from "mongoose";

const { Schema } = mongoose;

const statusCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        visibilityRank: { //for sorting
            type: Number,
            default: 0,
          },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const StatusCategory = mongoose.model("StatusCategory", statusCategorySchema);

export default StatusCategory;
