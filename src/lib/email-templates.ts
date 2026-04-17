"use strict";

import { AppConfig } from "./config/app.config";

interface EmailTemplateParams {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  baseUrl: string;
  year: number;
}

export function getPasswordResetEmailTemplate(
  params: EmailTemplateParams & { resetUrl: string }
): { html: string; text: string } {
  const { brandName, primaryColor, secondaryColor, resetUrl, year } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Reset Your Password - ${brandName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      Reset Your Password
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 20px; color: #555555; font-size: 16px;">
                      We received a request to reset the password for your ${brandName} account. If you made this request, click the button below to create a new password.
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td align="center" style="padding: 0;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px ${primaryColor}40;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 20px; color: #666666; font-size: 14px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0 0 30px; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all; color: ${primaryColor}; font-size: 13px; font-family: 'Courier New', monospace;">
                      ${resetUrl}
                    </p>
                    <div style="margin: 30px 0; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                      <p style="margin: 0 0 8px; color: #856404; font-size: 14px; font-weight: 600;">
                        ⚠️ Security Notice
                      </p>
                      <p style="margin: 0; color: #856404; font-size: 13px;">
                        This password reset link will expire in <strong>1 hour</strong> for your security. If you didn&apos;t request a password reset, please ignore this email and your password will remain unchanged.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #888888; font-size: 14px;">
                      If you continue to have problems, please contact our support team.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 13px; text-align: center;">
                      This email was sent by <strong>${brandName}</strong>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                      © ${year} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
Reset Your Password - ${brandName}

Hello,

We received a request to reset the password for your ${brandName} account. If you made this request, use the link below to create a new password.

Reset Password: ${resetUrl}

This password reset link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email and your password will remain unchanged.

If you continue to have problems, please contact our support team.

---
This email was sent by ${brandName}
© ${year} ${brandName}. All rights reserved.
  `;

  return { html, text };
}

export function getEmailVerificationTemplate(
  params: EmailTemplateParams & { name: string; verificationUrl: string }
): { html: string; text: string } {
  const { brandName, primaryColor, secondaryColor, name, verificationUrl, year } = params;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Verify Your Email - ${brandName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      Verify Your Email
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                      Hello ${name},
                    </p>
                    <p style="margin: 0 0 20px; color: #555555; font-size: 16px;">
                      Thank you for signing up for ${brandName}! Please verify your email address by clicking the button below to complete your registration.
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td align="center" style="padding: 0;">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px ${primaryColor}40;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 20px; color: #666666; font-size: 14px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0 0 30px; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all; color: ${primaryColor}; font-size: 13px; font-family: 'Courier New', monospace;">
                      ${verificationUrl}
                    </p>
                    <div style="margin: 30px 0; padding: 16px; background-color: #d1ecf1; border-left: 4px solid #0c5460; border-radius: 4px;">
                      <p style="margin: 0 0 8px; color: #0c5460; font-size: 14px; font-weight: 600;">
                        ℹ️ Important
                      </p>
                      <p style="margin: 0; color: #0c5460; font-size: 13px;">
                        This verification link will expire in <strong>24 hours</strong>. If you didn&apos;t create an account, please ignore this email.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #888888; font-size: 14px;">
                      If you continue to have problems, please contact our support team.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 13px; text-align: center;">
                      This email was sent by <strong>${brandName}</strong>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                      © ${year} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
Verify Your Email - ${brandName}

Hello ${name},

Thank you for signing up for ${brandName}! Please verify your email address by clicking the link below to complete your registration.

${verificationUrl}

This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.

If you continue to have problems, please contact our support team.

© ${year} ${brandName}. All rights reserved.
  `;

  return { html, text };
}

export function getContactFormEmailTemplate(
  params: EmailTemplateParams & {
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
  }
): { html: string; text: string } {
  const { brandName, primaryColor, secondaryColor, senderName, senderEmail, subject, message, year } = params;

  const safeName = senderName.replace(/[&<>"']/g, (m) => {
    const map: { [key: string]: string } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
  const safeEmail = senderEmail.replace(/[&<>"']/g, (m) => {
    const map: { [key: string]: string } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
  const safeSubject = subject.replace(/[&<>"']/g, (m) => {
    const map: { [key: string]: string } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
  const safeMessage = message.replace(/[&<>"']/g, (m) => {
    const map: { [key: string]: string } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  }).replace(/\n/g, '<br>');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>New Contact Form Submission - ${brandName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      New Contact Form Submission
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                      You have received a new message from the contact form on ${brandName}.
                    </p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid ${primaryColor};">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600; width: 120px;">Name:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${safeName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600;">Email:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                            <a href="mailto:${safeEmail}" style="color: ${primaryColor}; text-decoration: none;">${safeEmail}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600;">Subject:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${safeSubject}</td>
                        </tr>
                      </table>
                    </div>
                    <div style="margin: 30px 0;">
                      <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">Message:</h2>
                      <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 6px; color: #555555; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${safeMessage}</div>
                    </div>
                    <div style="margin: 30px 0; padding: 16px; background-color: #e3f2fd; border-left: 4px solid ${primaryColor}; border-radius: 4px;">
                      <p style="margin: 0; color: #1976d2; font-size: 14px;">
                        <strong>Reply to:</strong> <a href="mailto:${safeEmail}" style="color: #1976d2; text-decoration: none;">${safeEmail}</a>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 13px; text-align: center;">
                      This email was sent from the contact form on <strong>${brandName}</strong>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                      © ${year} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
New Contact Form Submission - ${brandName}

You have received a new message from the contact form on ${brandName}.

Name: ${senderName}
Email: ${senderEmail}
Subject: ${subject}

Message:
${message}

---
Reply to: ${senderEmail}
This email was sent from the contact form on ${brandName}
© ${year} ${brandName}. All rights reserved.
  `;

  return { html, text };
}

export function getContactConfirmationTemplate(
  params: EmailTemplateParams & {
    recipientName: string;
    subject: string;
  }
): { html: string; text: string } {
  const { brandName, primaryColor, secondaryColor, baseUrl, recipientName, subject, year } = params;

  const safeName = recipientName.replace(/[&<>"']/g, (m) => {
    const map: { [key: string]: string } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });
  const safeSubject = subject.replace(/[&<>"']/g, (m) => {
    const map: { [key: string]: string } = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[m];
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Thank You for Contacting Us - ${brandName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      Thank You for Contacting Us!
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px;">
                      Hello ${safeName},
                    </p>
                    <p style="margin: 0 0 20px; color: #555555; font-size: 16px;">
                      Thank you for reaching out to ${brandName}! We've received your message regarding <strong>"${safeSubject}"</strong> and our team will get back to you as soon as possible.
                    </p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-left: 4px solid ${primaryColor}; border-radius: 4px;">
                      <p style="margin: 0 0 10px; color: #1976d2; font-size: 14px; font-weight: 600;">
                        What happens next?
                      </p>
                      <ul style="margin: 10px 0 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                        <li>Our support team will review your message</li>
                        <li>We typically respond within 24-48 hours during business days</li>
                        <li>You'll receive a response at this email address</li>
                      </ul>
                    </div>
                    <p style="margin: 30px 0 20px; color: #555555; font-size: 16px;">
                      In the meantime, feel free to explore our <a href="${baseUrl}/faq" style="color: ${primaryColor}; text-decoration: none;">FAQ page</a> for quick answers to common questions.
                    </p>
                    <p style="margin: 30px 0 0; color: #888888; font-size: 14px;">
                      If you have any urgent concerns, please don't hesitate to reach out again.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 13px; text-align: center;">
                      This is an automated confirmation email from <strong>${brandName}</strong>
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                      © ${year} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
Thank You for Contacting Us - ${brandName}

Hello ${recipientName},

Thank you for reaching out to ${brandName}! We've received your message regarding "${subject}" and our team will get back to you as soon as possible.

What happens next?
- Our support team will review your message
- We typically respond within 24-48 hours during business days
- You'll receive a response at this email address

In the meantime, feel free to explore our FAQ page for quick answers to common questions.

If you have any urgent concerns, please don't hesitate to reach out again.

---
This is an automated confirmation email from ${brandName}
© ${year} ${brandName}. All rights reserved.
  `;

  return { html, text };
}
