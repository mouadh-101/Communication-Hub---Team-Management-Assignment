import User from '../models/User';
import Tenant from '../models/Tenant';

export const createUser = async (
  tenantId: string,
  email: string,
  name: string
): Promise<User> => {
  const user = await User.create({ tenantId, email, name });
  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await User.findByPk(id);
  return user;
};

export const getUserWithTenant = async (id: string): Promise<User | null> => {
  const user = await User.findByPk(id, {
    include: [{ model: Tenant, as: 'tenant' }],
  });
  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export const getUsersByTenant = async (tenantId: string): Promise<User[]> => {
  const users = await User.findAll({
    where: { tenantId },
    attributes: ['id', 'name', 'email', 'tenantId'],
    order: [['name', 'ASC']],
  });
  return users;
};
