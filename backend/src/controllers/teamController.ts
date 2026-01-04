import { Request, Response } from 'express';
import * as teamService from '../services/teamService';
import * as teamMemberService from '../services/teamMemberService';
import * as messageService from '../services/messageService';
import * as userService from '../services/userService';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
  };
}

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const tenantId = req.user?.tenantId;
    const userId = req.user?.userId;

    if (!tenantId || !name || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const team = await teamService.createTeam(tenantId, name, description);
    await teamMemberService.addMemberToTeam(team.id, userId);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
};

export const addTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const { userId } = req.body;
    const currentUserId = req.user?.userId;
    const currentTenantId = req.user?.tenantId;

    if (!currentUserId || !currentTenantId || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const team = await teamService.getTeamById(teamId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    if (team.tenantId !== currentTenantId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const hasAccess = await teamService.canUserAccessTeam(currentUserId, teamId);
    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const userToAdd = await userService.getUserById(userId);
    if (!userToAdd) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (userToAdd.tenantId !== currentTenantId) {
      res.status(403).json({ error: 'Cannot add user from different tenant' });
      return;
    }

    const teamMember = await teamMemberService.addMemberToTeam(teamId, userId);
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add team member' });
  }
};

export const getTeamMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const messages = await messageService.getMessagesByTeam(teamId, userId);

    if (messages === null) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

export const getTeamMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;

    if (!userId || !tenantId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const hasAccess = await teamService.canUserAccessTeam(userId, teamId);
    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const members = await teamMemberService.getTeamMembers(teamId);
    const filtered = members.filter((m) => m.tenantId === tenantId);
    res.status(200).json(filtered.map((m) => ({ id: m.id, name: m.name, email: m.email })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to get team members' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: teamId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId || !content) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const message = await messageService.sendMessage(userId, teamId, content);
    if (!message) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getTeams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;

    if (!userId || !tenantId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.tenantId !== tenantId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const allTeams = await teamService.getTeamsByTenant(tenantId);
    const teamsWithMembership = await Promise.all(
      allTeams.map(async (team) => {
        const isMember = await teamMemberService.isUserTeamMember(userId, team.id);
        return { ...team.toJSON(), isMember };
      })
    );

    res.status(200).json(teamsWithMembership);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get teams' });
  }
};
