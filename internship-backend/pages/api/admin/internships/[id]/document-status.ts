// pages/api/admin/internships/[id]/document-status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, InternshipStatus } from '@prisma/client';
import { decodeToken } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Yalnızca PATCH isteklerine izin verilir' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkisiz: Token eksik' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = decodeToken(token);

  if (!decoded || decoded.role !== 'COORDINATOR') {
    return res.status(403).json({ message: 'Erişim reddedildi: Yalnızca koordinatörler erişebilir.' });
  }

  const { id } = req.query;
  const { documentType, status } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Geçersiz staj ID\'si' });
  }

  if (!['internshipForm', 'unemploymentForm', 'healthForm'].includes(documentType)) {
    return res.status(400).json({ message: 'Geçersiz belge türü' });
  }

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Geçersiz durum değeri' });
  }

  try {
    // Staj kaydını getir
    const internship = await prisma.internship.findUnique({ where: { id } });
    if (!internship) {
      return res.status(404).json({ message: 'Staj kaydı bulunamadı.' });
    }

    // Güncellenecek alan ismini belirle
    const statusField = `${documentType}Status` as keyof typeof InternshipStatus;

    // Güncelle
    const updatedInternship = await prisma.internship.update({
      where: { id },
      data: {
        [statusField]: status as InternshipStatus,
      },
    });

    // TODO: Burada öğrenciye mail gönderme işlemi eklenebilir

    return res.status(200).json({ message: `Belge durumu başarıyla güncellendi (${documentType}: ${status})`, internship: updatedInternship });
  } catch (error) {
    console.error('[DOCUMENT_STATUS_UPDATE_ERROR]', error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
