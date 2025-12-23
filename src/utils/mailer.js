import {
  SESClient,
  SendEmailCommand,
  SendRawEmailCommand,
} from "@aws-sdk/client-ses";
import pug from "pug";
import path from "path";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: process.env.AWS_REGION });
import mime from "mime-types";
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const appName = process.env.APP_NAME;
const templateDir = path.join(process.cwd(), "src", "templates");

const streamToBuffer = async (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

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
    console.log(err);
    console.error("SES Email failed:", err.message);
    return false;
  }
};

export const sendSESWithMultipleS3Attachments = async (
  to,
  subject,
  html,
  files 
) => {
  try {
    let keys = files.map((url) =>
      decodeURIComponent(new URL(url).pathname.slice(1))
    );
    console.log(keys);
    const boundary = `NextPart_${Date.now()}`;

    let rawMessage = `From: ${process.env.APP_NAME} <${process.env.SMTP_FROM_ADDRESS}>
    To: ${to}
    Subject: ${subject}
    MIME-Version: 1.0
    Content-Type: multipart/mixed; boundary="${boundary}"

    --${boundary}
    Content-Type: text/html; charset="UTF-8"
    Content-Transfer-Encoding: 7bit

    ${html}
    `;

    for (const key of keys) {
      const cleanKey = key.startsWith("/") ? key.slice(1) : key;

      const s3Object = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: cleanKey,
        })
      );

      const buffer = await streamToBuffer(s3Object.Body);
      const base64File = buffer.toString("base64");
      const fileName = cleanKey.split("/").pop();
      const mimeType = mime.lookup(fileName) || "application/octet-stream";

      rawMessage += `
        --${boundary}
        Content-Type: ${mimeType}; name="${fileName}"
        Content-Disposition: attachment; filename="${fileName}"
        Content-Transfer-Encoding: base64
        ${base64File}
      `;
    }

    rawMessage += `\n--${boundary}--`;

    await sesClient.send(
      new SendRawEmailCommand({
        RawMessage: { Data: Buffer.from(rawMessage) },
      })
    );

    console.log("✅ SES email sent with multiple attachments");
    return true;
  } catch (err) {
    console.error("❌ SES Email failed:", err);
    return false;
  }
};

// ----- Registration OTP -----
export const sendRegistrationOtp = async (userData, otpData) => {
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
export const sendContactSolution = (contact, solutionMessage, files) => {
  try {
    const templatePath = path.join(templateDir, "contactSolution.pug");
    const html = pug.renderFile(templatePath, {
      name: contact.name,
      email: contact.email,
      message: solutionMessage,
      query: contact.message,
    });
    const subject = "Your Contact Query Response – Baubles";

    sendSESWithMultipleS3Attachments(contact.email, subject, html, files);
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

export const sendEmailToAdmin = async (userData, password) => {
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
