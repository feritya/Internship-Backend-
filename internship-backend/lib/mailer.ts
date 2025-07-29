// If you still see the error after installing @types/nodemailer, add the following line at the top of your file as a workaround:
declare module 'nodemailer';

import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, newPassword: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"İMU Staj Sistemi" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Şifre Sıfırlama',
    text: `Yeni şifreniz: ${newPassword}\nLütfen giriş yaptıktan sonra şifrenizi değiştirin.`
  });
}
