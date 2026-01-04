import Team from '../models/Team';
import User from '../models/User';
import { isUserTeamMember } from './teamMemberService';

export const createTeam = async (
  tenantId: string,
  name: string,
  description?: string
): Promise<Team> => {
  const team = await Team.create({ tenantId, name, description });
  return team;
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  const team = await Team.findByPk(id);
  return team;
};

export const getTeamsByTenant = async (tenantId: string): Promise<Team[]> => {
  const teams = await Team.findAll({
    where: { tenantId },
  });
  return teams;
};

export const canUserAccessTeam = async (
  userId: string,
  teamId: string
): Promise<boolean> => {
  const user = await User.findByPk(userId);
  if (!user) {
    return false;
  }

  const team = await Team.findByPk(teamId);
  if (!team) {
    return false;
  }

  if (user.tenantId !== team.tenantId) {
    return false;
  }

  const isMember = await isUserTeamMember(userId, teamId);
  return isMember;
};
