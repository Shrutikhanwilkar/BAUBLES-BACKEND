import User from "../../models/auth.model.js";
import { generateToken } from "../../utils/jwtHelper.js";
import { hashPassword, comparePassword } from "../../utils/passwordHelper.js";
import { generateOTP } from "../../utils/otpHelper.js";
import { sendRegistrationOtp, sendResendOtp } from "../../utils/mailer.js";
import AppError from "../../utils/appError.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
export class AuthService {
  async register(reqBody) {
    const { name, email, password } = reqBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError({
        status: false,
        message: "User already exists",
        httpStatus: HTTPStatusCode.CONFLICT,
      });
    }

    const hashedPassword = await hashPassword(password);
    const otpData = await generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: otpData.otp,
      // otp: "1234",
      otpExpiredAt: otpData.expiresAt,
    });
    await sendRegistrationOtp(user, otpData);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async login(reqBody, deviceToken, deviceType) {
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError({
        status: false,
        message: "Invalid password",
        httpStatus: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    if (!user.isEmailVerified) {
      throw new AppError({
        status: false,
        message: "Your account is not verified. Please verify your email.",
        httpStatus: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    if (user.status == "inactive") {
      throw new AppError({
      
        message:
          "Your account is deactived by admin, Please contact to admin for more information.",
        httpStatus: HTTPStatusCode.UNAUTHORIZED,
      });
    }

    //  Save Device Token & Device Type
    if (deviceToken) {
      await User.updateOne(
        { _id: user._id },
        { deviceToken: deviceToken, deviceType: deviceType }
      );
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      deviceToken,
      deviceType,
      token: generateToken(user._id, user.email, user.role),
    };
  }

  async verifyOtp(reqBody) {
    const { email, otp } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    if (user.otp !== otp) {
      throw new AppError({
        status: false,
        message: "Invalid OTP",
        httpStatus: HTTPStatusCode.BAD_REQUEST,
      });
    }

    if (Date.now() > user.otpExpiredAt) {
      throw new AppError({
        status: false,
        message: "OTP has expired. Please request a new one.",
        httpStatus: HTTPStatusCode.BAD_REQUEST,
      });
    }

    await User.findByIdAndUpdate(user._id, {
      otp: null,
      otpExpiredAt: null,
      isEmailVerified: true,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async resendOtp(reqBody) {
    const { email } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    const otpData = await generateOTP();

    await User.findByIdAndUpdate(user._id, {
      otp: otpData.otp,
      otpExpiredAt: otpData.expiresAt,
    });

    await sendResendOtp(user, otpData);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async changePassword(reqBody) {
    const { newPassword, user } = reqBody;

    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await User.findByIdAndUpdate(user.id, { password: hashedPassword });

    return {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };
  }

  async forgotPassword(reqBody) {
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError({
        status: false,
        message: "User not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    const hashedPassword = await hashPassword(password);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}
