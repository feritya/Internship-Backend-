import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Yalnızca POST isteklerine izin verilir' });
  }

  // Stateless logout (client tarafında token silinir)
  return res.status(200).json({
    message: 'Başarıyla çıkış yapıldı. Lütfen frontend tarafında tokenı silin.',
  });
}
