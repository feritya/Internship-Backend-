// pages/api/user/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { decodeToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkisiz: Token eksik' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = decodeToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş' });
  }

  const userId = decoded.userId;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { internships: true },
      });

      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error('[PROFILE_GET_ERROR]', error);
      return res.status(500).json({ message: 'Sunucu hatası', error });
    }
  }

  if (req.method === 'PUT') {
    const { name, phone, schoolNumber, grade, faculty, department } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          phone,
          schoolNumber,
          grade,
          faculty,
          department,
        },
      });

      return res.status(200).json({ message: 'Profil başarıyla güncellendi', user: updatedUser });
    } catch (error) {
      console.error('[PROFILE_UPDATE_ERROR]', error);
      return res.status(500).json({ message: 'Güncelleme hatası', error });
    }
  }

  return res.status(405).json({ message: 'Yalnızca GET ve PUT metotları desteklenir' });
}
