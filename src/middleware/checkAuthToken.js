import jwt from "jsonwebtoken";
import User from "../models/auth.model.js"
import { sendError } from "../utils/responseHelper.js";
import HTTPStatusCode from "../utils/httpStatusCode.js";
// import * as dotenv from 'dotenv';

// dotenv.config();

const authenticateToken = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['x-authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected: "Bearer <token>"
  if (!token) {
    return await sendError(
      res,
      'Access token required',
      HTTPStatusCode.UNAUTHORIZED
    )
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return await sendError(
        res,
        'Invalid or expired token',
        HTTPStatusCode.UNAUTHORIZED
      )
    }
    // Attach user info to request
    let userData = await User.findById(user.id).select("_id email role status name  isEmailVerified");
    if (!userData) {
      return await sendError(
        res,
        'User not found',
        HTTPStatusCode.NOT_FOUND
      )
    }
    // if (!userData.isOtpVerified) {
    //   return await errorResponse(
    //     res,
    //     'Please verify your otp',
    //     HTTP_STATUS.UNAUTHORIZED
    //   )
    // }
    // if (userData.status == status.In_ACTIVE) {
    //   return await errorResponse(
    //     res,
    //     'User Inactive',
    //     HTTP_STATUS.BAD_REQUEST
    //   )
    // }
    // if (userData.status == status.DELETED) {
    //   return await errorResponse(
    //     res,
    //     'User Deleted',
    //     HTTP_STATUS.BAD_REQUEST)
    // }
    if (!req.body) req.body = {};
    req.body.user = user;
    req.user = user;
    next();
  });
};

export default authenticateToken;
