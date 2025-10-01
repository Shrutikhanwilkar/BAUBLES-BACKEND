import nodemailer from "nodemailer"
import pug from "pug"
import path from "path";

const appName = process.env.APP_NAME
const sendEmail = async (name, email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_PORT == 465,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    transporter.verify((error, success) => {
        if (error) {
            console.error("Email server error:", error);
        } else {
            console.log("Email server is ready");
        }
    });

    const info = await transporter.sendMail({
        from: `${appName} <${process.env.SMTP_FROM_ADDRESS}>`,
        to: email,
        subject: subject,
        html: message,
    });


    console.log("Message sent: %s", info.messageId);
};

const templateDir = path.join(process.cwd(),"src", "templates");
console.log(templateDir)
export const sendRegistrationOtp = async (userData, otpData) => {
    const templatePath = path.join(templateDir, "signupOtp.pug");
    let messageBody = pug.renderFile(templatePath, {
        name: userData.name,
        email: userData.email,
        otp: otpData.otp,

    });
    let subject = "registration OTP for Baubles"
    await sendEmail(userData.name, userData.email, subject, messageBody);
    return true;
  };
