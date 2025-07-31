import { IncomingForm, File } from 'formidable';
import path from 'path';
import { PrismaClient, InternshipType, InternshipStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteği desteklenir.' });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), '/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form ayrıştırma hatası:', err);
      return res.status(400).json({ message: 'Form verileri ayrıştırılamadı.' });
    }

    try {
      const internshipForm = Array.isArray(files['internshipForm']) ? files['internshipForm'][0] : files['internshipForm'];
      const unemploymentForm = Array.isArray(files['unemploymentForm']) ? files['unemploymentForm'][0] : files['unemploymentForm'];
      const healthForm = Array.isArray(files['healthForm']) ? files['healthForm'][0] : files['healthForm'];

      const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
      const startDate = Array.isArray(fields.startDate) ? fields.startDate[0] : fields.startDate;
      const endDate = Array.isArray(fields.endDate) ? fields.endDate[0] : fields.endDate;

      if (!internshipForm || !unemploymentForm || !healthForm || !userId || !startDate || !endDate) {
        console.log('Eksik alanlar:', { internshipForm, unemploymentForm, healthForm, startDate, endDate, userId });
        return res.status(400).json({ message: 'Gerekli alanlar eksik.' });
      }

      const internship = await prisma.internship.create({
    data: {
      userId,
      type: 'VOLUNTARY',
      status: 'PENDING',
      internshipFormUrl: internshipForm.filepath,
      unemploymentFormUrl: unemploymentForm.filepath,
      healthFormUrl: healthForm.filepath,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
      });

      return res.status(200).json({ message: 'Staj başvurusu başarıyla oluşturuldu.', internship });
    } catch (error) {
      console.error('Sunucu hatası:', error);
      return res.status(500).json({ message: 'Sunucu hatası', error });
    }
  });
}
