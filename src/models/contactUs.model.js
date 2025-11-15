import mongoose from "mongoose";

const { Schema } = mongoose;

const contactUsSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        mobile: { type: String, trim: true },
        countryCode:{ type: String, trim: true },
        message: { type: String, required: true },
        isResolved:{type: Boolean, required: true,default:false},
        solution:{type: String, required: false,default:""},
        type:{
            type:String,
            required:true,
            trim:true,
            default:"Other",
                enum:["Other","App Question","Bauble Question","Support","Other"]
        }
    },
    { timestamps: true }
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;
