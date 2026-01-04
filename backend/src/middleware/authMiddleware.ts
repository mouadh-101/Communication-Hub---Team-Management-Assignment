import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const email = req.headers['x-user-email'] as string;

  if (!email) {
    res.status(401).json({ error: 'Unauthorized - Email required' });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = {
      userId: user.id,
      tenantId: user.tenantId,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};
