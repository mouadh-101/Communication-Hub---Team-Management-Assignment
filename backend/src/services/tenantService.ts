import Tenant from '../models/Tenant';

export const createTenant = async (name: string): Promise<Tenant> => {
  const tenant = await Tenant.create({ name });
  return tenant;
};

export const getTenantById = async (id: string): Promise<Tenant | null> => {
  const tenant = await Tenant.findByPk(id);
  return tenant;
};

export const getTenantByName = async (name: string): Promise<Tenant | null> => {
  const tenant = await Tenant.findOne({ where: { name } });
  return tenant;
};

export const getAllTenants = async (): Promise<Tenant[]> => {
  const tenants = await Tenant.findAll({ order: [['name', 'ASC']] });
  return tenants;
};
