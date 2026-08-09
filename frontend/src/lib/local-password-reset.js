import { validateStrongPassword } from "@/lib/email-rules";

const LOCAL_CUSTOMERS_KEY = "himu-local-customers";

function getLocalCustomers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CUSTOMERS_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Frontend-only password reset (does not call himu-backend).
 * Updates accounts stored in localStorage from local signup/login mock.
 */
export function resetLocalCustomerPassword(email, newPassword) {
  const normalized = String(email || "").toLowerCase().trim();
  if (!normalized || !normalized.includes("@")) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const pwdError = validateStrongPassword(newPassword);
  if (pwdError) return { ok: false, message: pwdError };

  const customers = getLocalCustomers();
  const index = customers.findIndex((c) => c.email === normalized);
  if (index < 0) {
    return {
      ok: false,
      message:
        "No account found for this email on this device. Sign up first, or contact Customercare@himupharmaceutical.com.",
    };
  }

  const next = customers.map((c, i) =>
    i === index ? { ...c, password: newPassword } : c,
  );
  localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(next));
  return { ok: true, message: "Password updated. You can log in with your new password." };
}
