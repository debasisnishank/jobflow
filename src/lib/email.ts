"use strict";

import nodemailer from "nodemailer";
import { DatabaseError } from "./errors";
import { getAppConfig } from "./admin/config.service";
import {
  getPasswordResetEmailTemplate,
  getEmailVerificationTemplate,
  getContactFormEmailTemplate,
  getContactConfirmationTemplate,
} from "./email-templates";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const smtpHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const smtpPort = process.env.EMAIL_PORT || process.env.SMTP_PORT;
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPassword = process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.EMAIL_FROM || process.env.FROM_EMAIL || process.env.SMTP_FROM;
  const smtpFromName = process.env.EMAIL_FROM_NAME;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFrom) {
    throw new DatabaseError("SMTP configuration is missing", {
      context: {
        function: "getTransporter",
        required: ["EMAIL_HOST (or SMTP_HOST)", "EMAIL_PORT (or SMTP_PORT)", "EMAIL_USER (or SMTP_USER)", "EMAIL_PASSWORD (or SMTP_PASSWORD)", "EMAIL_FROM (or FROM_EMAIL or SMTP_FROM)"],
      },
    });
  }

  // For Gmail, use secure connection and proper settings
  const isGmail = smtpHost.includes('gmail.com');
  const port = parseInt(smtpPort, 10);
  const isSecure = port === 465;

  // Gmail configuration
  if (isGmail) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  } else {
    // Generic SMTP configuration
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: isSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      ...(port === 587 && {
        requireTLS: true,
        tls: {
          rejectUnauthorized: false,
        },
      }),
    });
  }

  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const emailTransporter = getTransporter();
    const smtpFrom = process.env.EMAIL_FROM || process.env.FROM_EMAIL || process.env.SMTP_FROM;
    const smtpFromName = process.env.EMAIL_FROM_NAME;

    if (!smtpFrom) {
      throw new DatabaseError("EMAIL_FROM is not configured", {
        context: { function: "sendEmail" },
      });
    }

    const fromAddress = smtpFromName 
      ? `${smtpFromName} <${smtpFrom}>`
      : smtpFrom;

    await emailTransporter.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EAUTH') {
      const authError = error as { code: string; response?: string; responseCode?: number };
      console.error("SMTP Authentication Error:", {
        code: authError.code,
        response: authError.response,
        responseCode: authError.responseCode,
      });
      
      throw new DatabaseError(
        "SMTP authentication failed. Please check your SMTP credentials. For Gmail, you need to use an App Password instead of your regular password.",
        {
          context: { 
            function: "sendEmail", 
            to: options.to,
            errorType: "SMTP_AUTH_ERROR",
            hint: "If using Gmail, generate an App Password at: https://myaccount.google.com/apppasswords"
          },
          originalError: error instanceof Error ? error : new Error(String(error)),
        }
      );
    }
    
    const msg = "Failed to send email";
    throw new DatabaseError(msg, {
      context: { function: "sendEmail", to: options.to },
      originalError: error instanceof Error ? error : new Error(String(error)),
    });
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const config = await getAppConfig();
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_TRUST_HOST || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const primaryColor = config.primaryColor || "#3B82F6";
  const secondaryColor = config.secondaryColor || "#1D4ED8";

  const { html, text } = getPasswordResetEmailTemplate({
    brandName: config.brandName,
    primaryColor,
    secondaryColor,
    baseUrl,
    resetUrl,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    to: email,
    subject: `Reset Your ${config.brandName} Password`,
    html,
    text,
  });
}

export async function sendEmailVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<void> {
  const config = await getAppConfig();
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_TRUST_HOST || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
  const primaryColor = config.primaryColor || "#3B82F6";
  const secondaryColor = config.secondaryColor || "#1D4ED8";

  const { html, text } = getEmailVerificationTemplate({
    brandName: config.brandName,
    primaryColor,
    secondaryColor,
    baseUrl,
    name,
    verificationUrl,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    to: email,
    subject: `Verify Your Email - ${config.brandName}`,
    html,
    text,
  });
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function sendContactFormEmail({
  senderName,
  senderEmail,
  subject,
  message,
}: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<void> {
  const config = await getAppConfig();
  const supportEmail = config.supportEmail || process.env.EMAIL_FROM || process.env.SMTP_FROM || "support@jobflow.app";
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_TRUST_HOST || "http://localhost:3000";
  const primaryColor = config.primaryColor || "#3B82F6";
  const secondaryColor = config.secondaryColor || "#1D4ED8";

  const { html, text } = getContactFormEmailTemplate({
    brandName: config.brandName,
    primaryColor,
    secondaryColor,
    baseUrl,
    senderName,
    senderEmail,
    subject,
    message,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    to: supportEmail,
    subject: `[${config.brandName}] Contact Form: ${subject}`,
    html,
    text,
  });
}

export async function sendContactConfirmationEmail({
  recipientName,
  recipientEmail,
  subject,
}: {
  recipientName: string;
  recipientEmail: string;
  subject: string;
}): Promise<void> {
  const config = await getAppConfig();
  const baseUrl = process.env.NEXTAUTH_URL || process.env.AUTH_TRUST_HOST || "http://localhost:3000";
  const primaryColor = config.primaryColor || "#3B82F6";
  const secondaryColor = config.secondaryColor || "#1D4ED8";

  const { html, text } = getContactConfirmationTemplate({
    brandName: config.brandName,
    primaryColor,
    secondaryColor,
    baseUrl,
    recipientName,
    subject,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    to: recipientEmail,
    subject: `Thank You for Contacting ${config.brandName}`,
    html,
    text,
  });
}
