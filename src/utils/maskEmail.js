export function maskEmail(email) {
  if (!email) return "";

  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email;

  return email.slice(0, 3) + "***" + email.slice(atIndex);
}