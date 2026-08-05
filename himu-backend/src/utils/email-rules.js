/** Only real Google mail domains — blocks temp-mail style addresses. */
export function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim();
}

export function isGmailAddress(email) {
  const value = normalizeEmail(email);
  return /^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?@(gmail\.com|googlemail\.com)$/i.test(
    value,
  );
}

export function assertGmailAddress(email) {
  if (!isGmailAddress(email)) {
    const err = new Error("Only Gmail addresses (@gmail.com) are allowed. Temporary emails are not accepted.");
    err.status = 400;
    throw err;
  }
  return normalizeEmail(email);
}
