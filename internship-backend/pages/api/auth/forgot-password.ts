import { PrismaClient } from '@prisma/client';
import { sendPasswordResetEmail } from '../../../lib/mailer';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req: { method: string; body: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; error?: unknown; }): any; new(): any; }; }; }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST istekleri desteklenir' });
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı' });
    }

    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    await sendPasswordResetEmail(email, newPassword);

    return res.status(200).json({ message: 'Yeni şifre e-posta adresinize gönderildi' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
