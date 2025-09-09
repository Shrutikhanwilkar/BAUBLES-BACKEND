import mongoose from "mongoose";

const childrenSchema = new mongoose.Schema(
    {
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
          },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Children = mongoose.model("children", childrenSchema);

export default Children;
