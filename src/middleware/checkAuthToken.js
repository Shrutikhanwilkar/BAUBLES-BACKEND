import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import { sendError } from "../utils/responseHelper.js";
import HTTPStatusCode from "../utils/httpStatusCode.js";
import appVersionModel from "../models/appVersion.model.js";
// import * as dotenv from 'dotenv';

// dotenv.config();

const authenticateToken = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers["x-authorization"];
  const deviceToken = req.headers["device-token"];
  const deviceType = req.headers["device-type"];
  const version = req.headers["version"];
  let appversion = await appVersionModel.findOne();
  const requiredVersion =
    deviceType === "ios"
      ? appversion.iosVersion
      : deviceType === "android"
      ? appversion.androidVersion
      : null;

  if (requiredVersion && Number(requiredVersion) > Number(version)) {
    return await sendError(res, "Version Updated", HTTPStatusCode.UNAUTHORIZED);
  }

  const token = authHeader && authHeader.split(" ")[1]; // Expected: "Bearer <token>"
  if (!token) {
    return await sendError(
      res,
      "Access token required",
      HTTPStatusCode.UNAUTHORIZED
    );
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return await sendError(
        res,
        "Invalid or expired token",
        HTTPStatusCode.UNAUTHORIZED
      );
    }
    // Attach user info to request
    let userData = await User.findOneAndUpdate(
      { _id: user.id },
      { $set: { deviceToken, deviceType } },
      {
        new: true,
        select: "_id email role status name isEmailVerified",
      }
    );

    if (!userData) {
      return await sendError(res, "User not found", HTTPStatusCode.NOT_FOUND);
    }

    if (!req.body) req.body = {};
    req.body.user = user;
    req.user = user;
    next();
  });
};

export default authenticateToken;
