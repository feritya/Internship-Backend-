import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, InternshipStatus } from '@prisma/client';
import formidable, { IncomingForm } from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Geçersiz ID' });
  }

  if (req.method === 'GET') {
    // GET: Staj detaylarını getir
    try {
      const internship = await prisma.internship.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!internship) {
        return res.status(404).json({ message: 'Staj başvurusu bulunamadı.' });
      }

      return res.status(200).json({ internship });
    } catch (err) {
      return res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  if (req.method === 'PATCH') {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: 'Form ayrıştırılamadı.', error: err });
      }

      try {
        const internship = await prisma.internship.findUnique({ where: { id } });
        if (!internship) {
          return res.status(404).json({ message: 'Staj kaydı bulunamadı.' });
        }

        const data: any = {};

        // Dosya güncellemeleri
        if (files.internshipForm) {
          data.internshipFormUrl = files.internshipForm.filepath;
          data.internshipFormStatus = InternshipStatus.PENDING;
        }

        if (files.unemploymentForm) {
          data.unemploymentFormUrl = files.unemploymentForm.filepath;
          data.unemploymentFormStatus = InternshipStatus.PENDING;
        }

        if (files.healthForm) {
          data.healthFormUrl = files.healthForm.filepath;
          data.healthFormStatus = InternshipStatus.PENDING;
        }

        // Alan güncellemeleri
        if (fields.startDate) {
          data.startDate = new Date(fields.startDate as string);
        }

        if (fields.endDate) {
          data.endDate = new Date(fields.endDate as string);
        }

        if (Object.keys(data).length === 0) {
          return res.status(400).json({ message: 'Güncellenecek veri bulunamadı.' });
        }

        const updated = await prisma.internship.update({
          where: { id },
          data,
        });

        return res.status(200).json({ message: 'Staj güncellendi.', internship: updated });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Sunucu hatası', error });
      }
    });
  } else {
    return res.status(405).json({ message: 'Sadece GET veya PATCH istekleri desteklenir.' });
  }
}
