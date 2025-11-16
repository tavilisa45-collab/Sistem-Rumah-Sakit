import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRY = '7d';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  nama: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  });
};

export const getTokenFromCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value ?? null;
};

export const removeTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('token');
};

export const getCurrentUser = async (): Promise<TokenPayload | null> => {
  const token = await getTokenFromCookie();
  if (!token) return null;
  return verifyToken(token);
};

// Middleware untuk verify role
export const checkRole = (
  userRole: string,
  allowedRoles: string[]
): boolean => {
  return allowedRoles.includes(userRole);
};

// Generate nomor otomatis
export const generateNomorRekamMedis = (timestamp: number): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(5, '0');
  return `RM${year}${month}${random}`;
};

export const generateNomorResep = (): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `RX${year}${month}${day}${random}`;
};

export const generateNomorPermintaan = (prefix: string): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}${year}${month}${random}`;
};
