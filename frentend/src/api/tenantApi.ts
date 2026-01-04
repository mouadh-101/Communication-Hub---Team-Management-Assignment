import api from './api';
import type { Tenant } from '../types/index';

export const getTenants = async (): Promise<Tenant[]> => {
  const response = await api.get<Tenant[]>('/tenants');
  return response.data;
};
