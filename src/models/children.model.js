import mongoose from "mongoose";

const childrenSchema = new mongoose.Schema(
    {
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        dob: {
            type: Date,
            required: true,
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
