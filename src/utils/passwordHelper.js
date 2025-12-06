import bcrypt from "bcrypt";
import { Salt } from "./constants.js";


export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, Salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Could not hash the password.");
  }
};

export const comparePassword = async (password, hash) => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    return false;
  }
};
