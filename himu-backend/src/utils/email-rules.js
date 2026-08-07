/** Signup / auth email helpers */
export function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim();
}

const EMAIL_RE =
  /^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+$/i;

/** Block common disposable / temp-mail hosts */
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

export function assertSignupEmail(email) {
  if (!isSignupEmail(email)) {
    const err = new Error(
      "Enter a valid email address. Temporary / disposable emails are not allowed.",
    );
    err.status = 400;
    throw err;
  }
  return normalizeEmail(email);
}

/** @deprecated use assertSignupEmail */
export function assertGmailAddress(email) {
  return assertSignupEmail(email);
}

/** @deprecated use isSignupEmail */
export function isGmailAddress(email) {
  return isSignupEmail(email);
}
