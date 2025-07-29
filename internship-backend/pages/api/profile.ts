import { NextApiRequest, NextApiResponse } from 'next';
import { decodeToken } from '@/lib/auth'; // auth.ts içindeki helper fonksiyon
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Yalnızca GET isteklerine izin verilir' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkisiz: Token eksik' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = decodeToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        internships: true // geçmiş stajları da getiriyoruz
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('[PROFILE_ERROR]', error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
