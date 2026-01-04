import { Request, Response } from 'express';
import * as userService from '../services/userService';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
  };
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
};

export const listUsersByTenant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const users = await userService.getUsersByTenant(tenantId);
    res.status(200).json(users.map((u) => ({ id: u.id, name: u.name, email: u.email })));
  } catch (error) {
    const message = getErrorMessage(error);
    res.status(500).json({ error: 'Failed to list users', details: message });
  }
};
