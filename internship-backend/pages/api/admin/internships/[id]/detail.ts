import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Sadece GET isteği desteklenir.' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Geçerli bir staj ID gerekli.' });
  }

  try {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            schoolNumber: true,
            grade: true,
            internships: {
              where: {
                NOT: { id }, // Şu anki staj hariç
              },
              select: {
                type: true,
              },
            },
          },
        },
      },
    });

    if (!internship) {
      return res.status(404).json({ message: 'Staj başvurusu bulunamadı.' });
    }

    const student = {
      name: internship.user.name,
      email: internship.user.email,
      phone: internship.user.phone,
      schoolNumber: internship.user.schoolNumber,
      grade: internship.user.grade,
      pastInternships: internship.user.internships,
    };

    return res.status(200).json({
      internship: {
        id: internship.id,
        type: internship.type,
        status: internship.status,
        startDate: internship.startDate,
        endDate: internship.endDate,
        internshipFormUrl: internship.internshipFormUrl,
        unemploymentFormUrl: internship.unemploymentFormUrl,
        healthFormUrl: internship.healthFormUrl,
      },
      student,
    });

  } catch (error) {
    console.error('[ADMIN_INTERNSHIP_DETAIL_ERROR]', error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
