declare module 'nodemailer';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, newPassword: string) {
  await transporter.sendMail({
    from: `"İMU Staj Sistemi" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Şifre Sıfırlama',
    text: `Yeni şifreniz: ${newPassword}\nLütfen giriş yaptıktan sonra şifrenizi değiştirin.`,
  });
}

export async function sendInternshipStatusEmail(email: string, status: 'APPROVED' | 'REJECTED', userName: string) {
  const subject = status === 'APPROVED' ? 'Staj Başvurunuz Onaylandı' : 'Staj Başvurunuz Reddedildi';
  const text = `Merhaba ${userName},\n\nStaj başvurunuz ${status === 'APPROVED' ? 'onaylanmıştır.' : 'maalesef reddedilmiştir.'}\n\nSaygılarımızla.`;

  await transporter.sendMail({
    from: `"İMU Staj Sistemi" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
  });
}
