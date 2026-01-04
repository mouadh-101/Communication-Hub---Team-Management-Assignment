import '../models';
import Message from '../models/Message';
import User from '../models/User';
import { canUserAccessTeam } from './teamService';

export const sendMessage = async (
  userId: string,
  teamId: string,
  content: string
): Promise<Message | null> => {
  const hasAccess = await canUserAccessTeam(userId, teamId);
  if (!hasAccess) {
    return null;
  }

  const message = await Message.create({ userId, teamId, content });
  return message;
};

export const getMessagesByTeam = async (
  teamId: string,
  userId: string
): Promise<Message[] | null> => {
  const hasAccess = await canUserAccessTeam(userId, teamId);
  if (!hasAccess) {
    return null;
  }

  const messages = await Message.findAll({
    where: { teamId },
    include: [{ association: 'sender', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'ASC']],
  });

  return messages;
};
