import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    name,
    email,
    username,
    password,
    phone,
    schoolNumber,
    grade,
    faculty,
    department,
  } = req.body;

  if (!email || !username || !password || !name) {
    return res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        phone,
        schoolNumber,
        grade,
        faculty,
        department,
      },
    });

    return res.status(201).json({ message: 'Kayıt başarılı', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
}
