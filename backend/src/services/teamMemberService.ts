import TeamMember from '../models/TeamMember';
import User from '../models/User';
import Team from '../models/Team';

export const addMemberToTeam = async (
  teamId: string,
  userId: string
): Promise<TeamMember> => {
  const [teamMember] = await TeamMember.findOrCreate({
    where: { teamId, userId },
    defaults: { teamId, userId },
  });
  return teamMember;
};

export const removeMemberFromTeam = async (
  teamId: string,
  userId: string
): Promise<boolean> => {
  const deleted = await TeamMember.destroy({
    where: { teamId, userId },
  });
  return deleted > 0;
};

export const getTeamMembers = async (teamId: string): Promise<User[]> => {
  const team = await Team.findByPk(teamId, {
    include: [{ model: User, as: 'members' }],
  });
  return team?.get('members') as User[] || [];
};

export const isUserTeamMember = async (
  userId: string,
  teamId: string
): Promise<boolean> => {
  const teamMember = await TeamMember.findOne({
    where: { userId, teamId },
  });
  return teamMember !== null;
};
