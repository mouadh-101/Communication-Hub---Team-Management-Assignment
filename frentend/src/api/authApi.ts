import api from './api';
import type { User } from '../types/index';

export const login = async (email: string): Promise<User> => {
  const response = await api.post<User>('/auth/login', { email });
  return response.data;
};

export const register = async (email: string, name: string, tenantName?: string): Promise<User> => {
  const response = await api.post<User>('/auth/register', { email, name, tenantName });
  return response.data;
};
