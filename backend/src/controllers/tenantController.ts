import { Request, Response } from 'express';
import * as tenantService from '../services/tenantService';

export const listTenants = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await tenantService.getAllTenants();
    res.status(200).json(tenants.map((t) => ({ id: t.id, name: t.name })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};
