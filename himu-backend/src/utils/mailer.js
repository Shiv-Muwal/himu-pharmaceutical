import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) return null;
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
  return transporter;
}

export function isSmtpConfigured() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass);
}

export async function sendOtpEmail(to, otp) {
  const subject = "HIMU Pharmaceutical — email verification code";
  const text = `Your HIMU verification code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#14532d">
      <h2 style="margin:0 0 12px">Verify your email</h2>
      <p style="margin:0 0 16px;line-height:1.5">
        Use this one-time code to create your HIMU Pharmaceutical account:
      </p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;margin:0 0 16px">${otp}</p>
      <p style="margin:0;color:#547064;font-size:13px">
        Expires in 10 minutes. If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  const mailer = getTransporter();
  if (!mailer) {
    throw new Error(
      "Email delivery is not configured. Set SMTP_USER / SMTP_PASS in the server .env",
    );
  }

  await mailer.sendMail({
    from: env.smtpFrom || env.smtpUser,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true };
}
