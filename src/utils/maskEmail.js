export function maskEmail(email) {
  if (!email) return "";

  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email;

  const prefixLen = Math.min(3, atIndex);
  return email.slice(0, prefixLen) + "***" + email.slice(atIndex);
}