import authModel from "../../models/auth.model.js";
import { Role } from "../constants.js";

export const resetFirstAppOpenForAllUsers = async () => {
  try {
    const result = await authModel.updateMany(
      { role: Role.USER }, // Only parents
      { $set: { isFirstAppOpen: false } }
    );

    console.log(
      `🎉 Midnight Job Done — Updated ${result.modifiedCount} users.`
    );
  } catch (error) {
    console.error("❌ Error resetting isFirstAppOpen:", error);
  }
};
