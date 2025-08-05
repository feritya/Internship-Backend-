import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, InternshipStatus, InternshipType, Role } from '@prisma/client';
import { decodeToken } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Yalnızca GET isteği desteklenir.' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token eksik' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = decodeToken(token);

  if (!decoded || decoded.role !== 'COORDINATOR') {
    return res.status(403).json({ message: 'Erişim reddedildi. Yetkiniz yok.' });
  }

  try {
    const [total, approved, rejected, pending, voluntary, compulsory, totalStudents] = await Promise.all([
      prisma.internship.count(),
      prisma.internship.count({ where: { status: InternshipStatus.APPROVED } }),
      prisma.internship.count({ where: { status: InternshipStatus.REJECTED } }),
      prisma.internship.count({ where: { status: InternshipStatus.PENDING } }),
      prisma.internship.count({ where: { type: InternshipType.VOLUNTARY } }),
      prisma.internship.count({ where: { type: InternshipType.COMPULSORY } }),
      prisma.user.count({ where: { role: Role.STUDENT } })
    ]);

    return res.status(200).json({
      totalInternships: total,
      approved,
      rejected,
      pending,
      voluntary,
      compulsory,
      totalStudents
    });
  } catch (error) {
    console.error('Dashboard hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
