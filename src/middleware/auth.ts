import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sri_fabrics_jwt_secure_secret_2026_key';

export interface AuthRequest extends Request {
  user?: any;
  isAdmin?: boolean;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  // Try JWT first (for admin email/password sessions)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && decoded.role === 'admin') {
      req.user = decoded;
      req.isAdmin = true;
      return next();
    }
  } catch {
    // Fall through to Firebase check
  }

  // Try Firebase ID token
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    req.isAdmin = true; // Admin user verified
    return next();
  } catch (firebaseErr) {
    console.error('Auth verification failed:', firebaseErr);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const generateAdminToken = (admin: { id: number; email: string; name: string; role: string }) => {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
