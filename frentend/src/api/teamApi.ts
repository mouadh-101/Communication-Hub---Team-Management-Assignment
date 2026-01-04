import api from './api';
import type { Team, Message, TeamMember, UserSummary } from '../types/index';

export const getTeams = async (): Promise<Team[]> => {
  const response = await api.get<Team[]>('/teams');
  return response.data;
};

export const getTeamMessages = async (teamId: string): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/teams/${teamId}/messages`);
  return response.data;
};

export const sendMessage = async (teamId: string, content: string): Promise<Message> => {
  const response = await api.post<Message>(`/teams/${teamId}/messages`, { content });
  return response.data;
};

export const addTeamMember = async (teamId: string, userId: string): Promise<TeamMember> => {
  const response = await api.post<TeamMember>(`/teams/${teamId}/members`, { userId });
  return response.data;
};

export const createTeam = async (name: string, description?: string): Promise<Team> => {
  const response = await api.post<Team>('/teams', { name, description });
  return response.data;
};

export const getTeamMembers = async (teamId: string): Promise<UserSummary[]> => {
  const response = await api.get<UserSummary[]>(`/teams/${teamId}/members`);
  return response.data;
};

export const getTenantUsers = async (): Promise<UserSummary[]> => {
  const response = await api.get<UserSummary[]>('/users');
  return response.data;
};
