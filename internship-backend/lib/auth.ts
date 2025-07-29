// lib/auth.ts
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}
export function decodeToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: string; role: string };
  } catch (err) {
    return null;
  }
}
