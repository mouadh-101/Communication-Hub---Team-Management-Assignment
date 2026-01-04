import { Router } from 'express';
import * as teamController from '../controllers/teamController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/teams', authMiddleware, teamController.getTeams);
router.post('/teams', authMiddleware, teamController.createTeam);
router.post('/teams/:id/members', authMiddleware, teamController.addTeamMember);
router.get('/teams/:id/members', authMiddleware, teamController.getTeamMembers);
router.get('/teams/:id/messages', authMiddleware, teamController.getTeamMessages);
router.post('/teams/:id/messages', authMiddleware, teamController.sendMessage);

export default router;
