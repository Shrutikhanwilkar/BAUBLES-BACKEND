import nodemailer from "nodemailer"

const sendEmail = async (name, email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: true,
        auth: {
            user: env.MAIL_USERNAME,
            pass: env.MAIL_PASSWORD,
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
        from: `${constants.CONST_APP_NAME} <${constants.CONST_SMTP_FROM_ADDRESS}>`,
        to: email,
        subject: subject,
        html: message,
    });

    console.log("Message sent: %s", info.messageId);
};