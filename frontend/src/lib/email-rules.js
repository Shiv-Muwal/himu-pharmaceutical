export function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim();
}

/** Only Google mail domains — blocks temp-mail style addresses. */
export function isGmailAddress(email) {
  const value = normalizeEmail(email);
  return /^[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?@(gmail\.com|googlemail\.com)$/i.test(
    value,
  );
}

export function gmailErrorMessage() {
  return "Only Gmail (@gmail.com) is allowed. Temporary email IDs are not accepted.";
}
