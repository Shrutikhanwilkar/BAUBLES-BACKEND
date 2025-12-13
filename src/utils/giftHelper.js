
import Children from "../models/children.model.js";
import authModel from "../models/auth.model.js";

export const isWeekend = (date = new Date()) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isHolidayPeriod = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (month === 11 && day >= 24) || (month === 12 && day <= 14);
};

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/* Age Match */
export const isAgeMatch = async (userId, pkg) => {
  if (!pkg.minAge || !pkg.maxAge) return false;

  const children = await Children.find({ parentId: userId })
    .select("dob")
    .lean();

  return children.some((child) => {
    const age = calculateAge(child.dob);
    return age >= pkg.minAge && age <= pkg.maxAge;
  });
};

/* First App Open */
export const isFirstAppOpenToday = async (userId) => {
  const user = await authModel.findById(userId).select("isFirstAppOpen").lean();

  return Boolean(user?.isFirstAppOpen);
};

export const isPackageActiveByDate = (pkg, date = new Date()) => {
  if (!pkg.startDate || !pkg.endDate) return true; // safety fallback

  const today = new Date(date);
  today.setHours(0, 0, 0, 0);

  const start = new Date(pkg.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(pkg.endDate);
  end.setHours(23, 59, 59, 999);

  return today >= start && today <= end;
};
