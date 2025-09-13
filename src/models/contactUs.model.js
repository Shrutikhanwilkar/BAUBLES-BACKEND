import mongoose from "mongoose";

const { Schema } = mongoose;

const contactUsSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        mobile: { type: String, trim: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;
