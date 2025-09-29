import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, ref: "Children", required: true },
        statusCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "StatusCategory", required: true },
        musicId: { type: mongoose.Schema.Types.ObjectId, ref: "Music", required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
