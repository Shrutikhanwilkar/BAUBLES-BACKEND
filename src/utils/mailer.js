import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";

const appName = process.env.APP_NAME;

// Send email in background safely
const sendEmail = async (name, email, subject, message) => {
    try {
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
                console.error("Email server verification failed:", error);
            } else {
                console.log("Email server is ready");
            }
        });

        const info = await transporter.sendMail({
            from: `${appName} <${process.env.SMTP_FROM_ADDRESS}>`,
            to: email,
            subject,
            html: message,
        });

        console.log("Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("Failed to send email:", error.message);
        // No error is thrown, runs silently in background
    }
};

// Template directory
const templateDir = path.join(process.cwd(), "src", "templates");

// Send registration OTP without blocking
export const sendRegistrationOtp = (userData, otpData) => {
    try {
        const templatePath = path.join(templateDir, "signupOtp.pug");
        const messageBody = pug.renderFile(templatePath, {
            name: userData.name,
            email: userData.email,
            otp: otpData.otp,
        });

        const subject = "Registration OTP for Baubles";

        // Run in background, no await
        sendEmail(userData.name, userData.email, subject, messageBody);
    } catch (err) {
        console.error("Failed to render/send OTP email:", err.message);
    }

    return true; // Always return true immediately
};
