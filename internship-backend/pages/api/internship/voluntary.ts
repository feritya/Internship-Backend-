// pages/api/internship/[id]/update-document.ts
import { IncomingForm, File } from 'formidable';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, InternshipStatus } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Dosya ya dizi olabilir, filepath güvenli şekilde alınır
function getFilePath(fileOrFiles?: File | File[]): string | undefined {
  if (!fileOrFiles) return undefined;
  if (Array.isArray(fileOrFiles)) return fileOrFiles[0].filepath;
  return fileOrFiles.filepath;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Staj kaydını getir
    const { id } = req.query;
    if (typeof id !== 'string') return res.status(400).json({ message: 'Geçersiz ID' });

    try {
      const internship = await prisma.internship.findUnique({
        where: { id },
      });
      if (!internship) return res.status(404).json({ message: 'Staj kaydı bulunamadı' });
      return res.status(200).json({ internship });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Sunucu hatası', error });
    }
  } else if (req.method === 'PATCH') {
    const { id } = req.query;
    if (typeof id !== 'string') return res.status(400).json({ message: 'Geçersiz ID' });

    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), '/uploads'),
      keepExtensions: true,
      multiples: false, // Tek dosya
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form ayrıştırma hatası:', err);
        return res.status(400).json({ message: 'Form ayrıştırılamadı', error: err });
      }

      try {
        const internship = await prisma.internship.findUnique({ where: { id } });
        if (!internship) return res.status(404).json({ message: 'Staj kaydı bulunamadı' });

        const data: any = {};

        // Dosyalar varsa güncelle
        const internshipFormPath = getFilePath(files.internshipForm);
        if (internshipFormPath) {
          data.internshipFormUrl = internshipFormPath;
          data.internshipFormStatus = InternshipStatus.PENDING;
        }

        const unemploymentFormPath = getFilePath(files.unemploymentForm);
        if (unemploymentFormPath) {
          data.unemploymentFormUrl = unemploymentFormPath;
          data.unemploymentFormStatus = InternshipStatus.PENDING;
        }

        const healthFormPath = getFilePath(files.healthForm);
        if (healthFormPath) {
          data.healthFormUrl = healthFormPath;
          data.healthFormStatus = InternshipStatus.PENDING;
        }

        // startDate ve endDate alanlarını da güncelle
        if (fields.startDate && typeof fields.startDate === 'string') {
          data.startDate = new Date(fields.startDate);
        }
        if (fields.endDate && typeof fields.endDate === 'string') {
          data.endDate = new Date(fields.endDate);
        }

        if (Object.keys(data).length === 0) {
          return res.status(400).json({ message: 'Güncellenecek veri bulunamadı.' });
        }

        const updatedInternship = await prisma.internship.update({
          where: { id },
          data,
        });

        return res.status(200).json({ message: 'Staj kaydı güncellendi.', internship: updatedInternship });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Sunucu hatası', error });
      }
    });
  } else {
    return res.status(405).json({ message: 'Sadece GET ve PATCH isteklerine izin verilir.' });
  }
}
