import mongoose from "mongoose";
import AppError from "./appError.js";

export const globalErrorHandler = async (error, req, res, next) => {
  

    // ✅ Mongoose Validation Error
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            status: false,
            success: false,
            statusCode: 400,
            message: "Validation error",
            errors: Object.values(error.errors).map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
    }

    // ✅ Mongoose CastError (e.g. invalid ObjectId)
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            status: false,
            success: false,
            statusCode: 400,
            message: "Invalid ID format",
            errors: {
                field: error.path,
                message: `Invalid value for ${error.path}`,
            },
        });
    }

    // ✅ MongoDB Duplicate Key Error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0] || "unknown_field";
        return res.status(409).json({
            status: false,
            success: false,
            statusCode: 409,
            message: `${field} already exists`,
            errors: {
                field,
                message: `${field} must be unique`,
            },
        });
    }

    // ✅ Custom AppError
    if (error instanceof AppError) {
        return res.status(error.httpStatus || 400).json({
            status: false,
            success: false,
            statusCode: error.httpStatus || 400,
            message: error.message,
        });
    }

    // ✅ Generic Fallback
    console.error("Unhandled error:", error);

    return res.status(500).json({
        status: false,
        success: false,
        statusCode: 500,
        message: "Internal Server Error",
        details: error.message,
    });
};
