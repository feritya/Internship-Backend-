import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Sadece PATCH isteklerine izin verilir' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  let decoded;
  try {
    decoded = verify(token, SECRET) as { userId: string };
  } catch (err) {
    return res.status(401).json({ message: 'Token geçersiz' });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Mevcut ve yeni şifre zorunludur' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mevcut şifre hatalı' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({ message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
