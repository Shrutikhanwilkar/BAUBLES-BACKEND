import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import pug from "pug";
import path from "path";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const appName = process.env.APP_NAME;
const templateDir = path.join(process.cwd(), "src", "templates");

// Send Email using AWS SES
export const sendSES = async (to, subject, html) => {
  try {
    const params = {
      Source: `${appName} <${process.env.SMTP_FROM_ADDRESS}>`,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    };
    await sesClient.send(new SendEmailCommand(params));

    console.log("SES Email sent:", subject);
    return true;
  } catch (err) {
    console.log(err)
    console.error("SES Email failed:", err.message);
    return false;
  }
};

// ----- Registration OTP -----
export const sendRegistrationOtp =async(userData, otpData) => {
  try {
    const templatePath = path.join(templateDir, "signupOtp.pug");

    const html = pug.renderFile(templatePath, {
      name: userData.name,
      email: userData.email,
      otp: otpData.otp,
    });

    const subject = "Registration OTP for Baubles";

    sendSES(userData.email, subject, html); // Background send
  } catch (err) {
    console.error("Failed to render/send OTP email:", err.message);
  }

  return true;
};

// ----- Contact Us Response -----
export const sendContactSolution = (contact, solutionMessage,files) => {
  try {
    const templatePath = path.join(templateDir, "contactSolution.pug");
    const html = pug.renderFile(templatePath, {
      name: contact.name,
      email: contact.email,
      message: solutionMessage,
      query:contact.message
    });
    const subject = "Your Contact Query Response – Baubles";

    sendSES(contact.email, subject, html);
  } catch (err) {
    console.error("Failed to send contact solution email:", err.message);
  }

  return true;
};

export const sendResendOtp = async (userData, otpData) => {
  try {
    const templatePath = path.join(templateDir, "resendOtp.pug"); 

    const html = pug.renderFile(templatePath, {
      name: userData.name,
      email: userData.email,
      otp: otpData.otp,
    });

    const subject = "Baubles Verification Code";

    await sendSES(userData.email, subject, html);
  } catch (err) {
    console.error("Failed to render/send OTP email:", err.message);
  }

  return true;
};

export const sendForgotPasswordOtp = async (userData, otpData) => {
  try {
    const templatePath = path.join(templateDir, "forgotPasswordOtp.pug");

    const html = pug.renderFile(templatePath, {
      name: userData.name,
      email: userData.email,
      otp: otpData.otp,
      expiresIn: otpData.expiresIn || 10, // optional expiry
    });

    const subject = "Forgot Password OTP - Baubles";

    await sendSES(userData.email, subject, html);
  } catch (err) {
    console.error(
      "Failed to render/send Forgot Password OTP email:",
      err.message
    );
  }

  return true;
};

// ----- Admin Create OTP -----
export const sendEmailToAdmin =async(userData, password) => {
  try {
    const templatePath = path.join(templateDir, "adminEmail.pug");

    const html = pug.renderFile(templatePath, {
      name: userData.name,
      email: userData.email,
      password: password,
    });

    const subject = "Login Password";

    sendSES(userData.email, subject, html); // Background send
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }

  return true;
};

