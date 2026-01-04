import Tenant from './Tenant';
import User from './User';
import Team from './Team';
import TeamMember from './TeamMember';
import Message from './Message';

const initializeAssociations = () => {
  // Tenant associations
  Tenant.hasMany(User, {
    foreignKey: 'tenantId',
    as: 'users',
  });

  Tenant.hasMany(Team, {
    foreignKey: 'tenantId',
    as: 'teams',
  });

  // User associations
  User.belongsTo(Tenant, {
    foreignKey: 'tenantId',
    as: 'tenant',
  });

  User.belongsToMany(Team, {
    through: TeamMember,
    foreignKey: 'userId',
    otherKey: 'teamId',
    as: 'teams',
  });

  User.hasMany(TeamMember, {
    foreignKey: 'userId',
    as: 'teamMemberships',
  });

  User.hasMany(Message, {
    foreignKey: 'userId',
    as: 'messages',
  });

  // Team associations
  Team.belongsTo(Tenant, {
    foreignKey: 'tenantId',
    as: 'tenant',
  });

  Team.belongsToMany(User, {
    through: TeamMember,
    foreignKey: 'teamId',
    otherKey: 'userId',
    as: 'members',
  });

  Team.hasMany(TeamMember, {
    foreignKey: 'teamId',
    as: 'teamMembers',
  });

  Team.hasMany(Message, {
    foreignKey: 'teamId',
    as: 'messages',
  });

  // TeamMember associations
  TeamMember.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  TeamMember.belongsTo(Team, {
    foreignKey: 'teamId',
    as: 'team',
  });

  // Message associations
  Message.belongsTo(Team, {
    foreignKey: 'teamId',
    as: 'team',
  });

  Message.belongsTo(User, {
    foreignKey: 'userId',
    as: 'sender',
  });
};

initializeAssociations();

export {
  Tenant,
  User,
  Team,
  TeamMember,
  Message,
  initializeAssociations,
};

export default {
  Tenant,
  User,
  Team,
  TeamMember,
  Message,
};
