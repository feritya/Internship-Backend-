// pages/api/admin/internships/[id]/status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, InternshipStatus } from '@prisma/client';
import { sendInternshipStatusEmail } from '@/lib/mailer';  // mail gönderme fonksiyonun

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Sadece PATCH desteklenir.' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!id || !status || ![InternshipStatus.APPROVED, InternshipStatus.REJECTED].includes(status)) {
    return res.status(400).json({ message: 'Geçersiz parametreler.' });
  }

  try {
    // Staj kaydı kontrolü
    const internship = await prisma.internship.findUnique({ where: { id: id as string }, include: { user: true } });
    if (!internship) {
      return res.status(404).json({ message: 'Staj başvurusu bulunamadı.' });
    }

    // Status güncelle
    const updatedInternship = await prisma.internship.update({
      where: { id: id as string },
      data: { status },
    });

await sendInternshipStatusEmail(internship.user.email, status as 'APPROVED' | 'REJECTED', internship.user.name);

    return res.status(200).json({ message: 'Staj durumu güncellendi.', internship: updatedInternship });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası.', error });
  }
}
