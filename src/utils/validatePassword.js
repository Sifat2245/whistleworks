/**
 * Password validation helper
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters" };
  }
  return { isValid: true, message: "" };
};

/**
 * Checks if two passwords match
 */
export const doPasswordsMatch = (password, confirmation) => {
  if (!password && !confirmation) return true;
  return password === confirmation;
};
