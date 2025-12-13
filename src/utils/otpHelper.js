export const generateOTP = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Set expiration for 10 minutes from now.
  const expiresAt = Date.now() + 10 * 60 * 1000;

  return {
    otp: otp.toString(),
    // otp: "1234",
    expiresAt: expiresAt,
  };
};
