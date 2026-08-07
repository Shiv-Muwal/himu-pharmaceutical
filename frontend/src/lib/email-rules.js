/** Signup email helpers (frontend) */

export function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim();
}

const EMAIL_RE =
  /^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+$/i;

const BLOCKED_HOSTS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
]);

export function isSignupEmail(email) {
  const value = normalizeEmail(email);
  if (!EMAIL_RE.test(value) || value.length > 254) return false;
  const host = value.split("@")[1] || "";
  if (BLOCKED_HOSTS.has(host)) return false;
  return true;
}

export function signupEmailErrorMessage() {
  return "Enter a valid email. Temporary / disposable emails are not allowed.";
}

/** Strong password: min 8, upper, lower, number, special */
export function validateStrongPassword(password) {
  const value = String(password || "");
  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (value.length > 128) {
    return "Password is too long.";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must include an uppercase letter (A-Z).";
  }
  if (!/[a-z]/.test(value)) {
    return "Password must include a lowercase letter (a-z).";
  }
  if (!/[0-9]/.test(value)) {
    return "Password must include a number (0-9).";
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Password must include a special character (!@#$…).";
  }
  return "";
}

/** @deprecated */
export function isGmailAddress(email) {
  return isSignupEmail(email);
}

/** @deprecated */
export function gmailErrorMessage() {
  return signupEmailErrorMessage();
}
