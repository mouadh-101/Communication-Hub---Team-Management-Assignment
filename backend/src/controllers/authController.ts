import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as tenantService from '../services/tenantService';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      userId: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, tenantId, tenantName } = req.body;

    if (!email || !name) {
      res.status(400).json({ error: 'Email and name are required' });
      return;
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    let targetTenantId = tenantId;

    if (!targetTenantId && tenantName) {
      const existingTenant = await tenantService.getTenantByName(tenantName);
      if (existingTenant) {
        targetTenantId = existingTenant.id;
      } else {
        const newTenant = await tenantService.createTenant(tenantName);
        targetTenantId = newTenant.id;
      }
    }

    if (!targetTenantId) {
      const tenant = await tenantService.createTenant(`Tenant for ${name}`);
      targetTenantId = tenant.id;
    }

    const user = await userService.createUser(targetTenantId, email, name);

    res.status(201).json({
      userId: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: 'User creation failed' });
  }
};
