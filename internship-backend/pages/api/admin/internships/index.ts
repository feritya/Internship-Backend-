import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { decodeToken } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Sadece GET desteklenir' });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Yetkisiz' });

  const token = authHeader.split(' ')[1];
  const decoded = decodeToken(token);

  if (!decoded || decoded.role !== 'COORDINATOR') {
    return res.status(403).json({ message: 'Erişim reddedildi' });
  }

  try {
    const internships = await prisma.internship.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ internships });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
}
