import nodemailer from "nodemailer"


const appName = process.env.APP_NAME
const sendEmail = async (name, email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
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
export const sendRegistrationOtp = async (userData, otpData) => {
    let templateDir = "templates/";
    let messageBody = pug.renderFile(`${templateDir}signupOtp.pug`, {
        name: userData.fullName,
        email: userData.email,
        otp: otpData.randomOtp,

    });
    let subject = i18n.__("lang_registration_otp");
    await sendEmail(userData.name, userData.email, subject, messageBody);
    return true;
  };