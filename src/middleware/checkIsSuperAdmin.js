import { Role } from "../utils/constants.js";
import HTTPStatusCode from "../utils/httpStatusCode.js";

export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== Role.SUPERADMIN) {
    return res
      .status(HTTPStatusCode.UNAUTHORIZED)
      .json({ message: "Access denied: Super Admin only." });
  }
  next();
};
