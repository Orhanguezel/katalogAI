// src/modules/exports/mail-service.ts
// Email service for sending catalog PDFs

import nodemailer from 'nodemailer';
import { env } from '@/core/env';

interface SendCatalogEmailOpts {
  to: string;
  subject: string;
  message?: string;
  catalogTitle: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}

function createTransport() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendCatalogEmail(opts: SendCatalogEmailOpts): Promise<void> {
  const transporter = createTransport();

  const htmlBody = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 28px; font-weight: bold; color: #c29d5d; font-family: Georgia, serif;">K</span>
        <span style="font-size: 16px; font-weight: 600; margin-left: 4px;">KatalogAI</span>
      </div>
      <h2 style="margin-bottom: 8px;">${opts.catalogTitle}</h2>
      ${opts.message ? `<p style="color: #555; margin-bottom: 16px;">${opts.message}</p>` : ''}
      <p style="color: #888; font-size: 13px;">PDF katalog ekte yer almaktadır.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 11px; color: #aaa; text-align: center;">
        KatalogAI ile oluşturuldu
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: env.MAIL_FROM || `"KatalogAI" <noreply@katalogai.com>`,
    to: opts.to,
    subject: opts.subject,
    html: htmlBody,
    attachments: [
      {
        filename: opts.pdfFilename,
        content: opts.pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
