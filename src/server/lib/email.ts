import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('GMAIL_USER e GMAIL_APP_PASSWORD não configurados');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

/**
 * Envia email transacional via Gmail SMTP (senha de app).
 * Usado para recuperação de senha e, futuramente, emails financeiros.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const transport = getTransport();
  const from = `"Acolha" <${process.env.GMAIL_USER}>`;

  await transport.sendMail({ from, to, subject, html });
}
