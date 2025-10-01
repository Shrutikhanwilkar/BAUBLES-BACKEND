import User from "../../models/auth.model.js"
import { generateToken } from "../../utils/jwtHelper.js";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import { hashPassword ,comparePassword} from "../../utils/passwordHelper.js";
import { generateOTP } from "../../utils/otpHelper.js";
import { sendRegistrationOtp } from "../../utils/mailer.js";

export class AuthService {
  async register(reqBody) {
    let { name, email, password } = reqBody;
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = HTTPStatusCode.CONFLICT;
      throw error;
    }
    let hashedPassword = await hashPassword(password);
    let otpData = await generateOTP();
    // Create new user
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      otp: otpData.otp,
      otpExpiredAt: otpData.expiresAt,
    });
    sendRegistrationOtp(user, otpData)
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async login(reqBody) {
    let { email, password } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = HTTPStatusCode.NOT_FOUND;
      throw error;
    }
    const isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) {
      const error = new Error("Password Incorrect");
      error.statusCode = HTTPStatusCode.UNAUTHORIZED;
      throw error;
    }
    if (!user.isEmailVerified) {
      const error = new Error("Your Account is not verified. Please Verify");
      error.statusCode = HTTPStatusCode.UNAUTHORIZED;
      throw error;
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id,user.email, user.role),
    };
  }

  async verifyOtp(reqBody) {
    let { email, otp } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = HTTPStatusCode.NOT_FOUND;
      throw error;
    }
    if (user.otp != otp) {
      const error = new Error("Invalid Otp");
      error.statusCode = HTTPStatusCode.BAD_REQUEST;
      throw error;
    }
    let currentTime = Date.now();
    if (currentTime > user.otpExpiredAt) {
      const error = new Error("Otp Expired. Please Click On Resend");
      error.statusCode = HTTPStatusCode.BAD_REQUEST;
      throw error;
    }

    await User.findOneAndUpdate(
      { email: email },
      { otp: null, otpExpiredAt: null, isEmailVerified: true }
    );
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async resendOtp(reqBody) {
    let { email } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = HTTPStatusCode.NOT_FOUND;
      throw error;
    }
    let otpData = generateOTP();

    await User.findOneAndUpdate(
      { email: email },
      { otp: "1234", otpExpiredAt: (await otpData).expiresAt }
    );
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

    async changePassword(reqBody) {
    let { newPassword} = reqBody;
  
    const user = await User.findOne({ _id:reqBody.user.id });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = HTTPStatusCode.NOT_FOUND;
      throw error;
    }
    let hashedPassword=await hashPassword(newPassword)
    await User.findOneAndUpdate(
      { _id:reqBody.user.id },
      { password:hashedPassword }
    );
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

    async forgotPassword(reqBody) {
    let { email ,password} = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = HTTPStatusCode.NOT_FOUND;
      throw error;
    }
    let hashedPassword=await hashPassword(password)
    await User.findOneAndUpdate(
      { email: email },
      { password:hashedPassword }
    );
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }
}


