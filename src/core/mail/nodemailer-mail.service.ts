import nodemailer, { type Transporter } from "nodemailer";

import type { MailService } from "./mail.service.js";

export class NodemailerMailService implements MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,

      to: email,

      subject: "Password reset code",

      text: `
Your password reset code is: ${code}

The code expires in 3 minutes.

If you did not request a password reset, you can safely ignore this email.
      `.trim(),

      html: `
        <p>You requested a password reset.</p>

        <p>Your verification code:</p>

        <h1>${code}</h1>

        <p>This code expires in 3 minutes.</p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>
      `,
    });
  }
}
