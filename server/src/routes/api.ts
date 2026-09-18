import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { EventController } from '../controllers/eventController';
import { ChatController } from '../controllers/chatController';
import { RiskController } from '../controllers/riskController';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'PlanCraft AI by The Xperience',
    timestamp: new Date().toISOString(),
  });
});

// Auth
router.post('/auth/login', AuthController.login);
router.post('/auth/demo-login', AuthController.demoLogin);
router.get('/auth/me', AuthController.me);

// Events
router.get('/events', EventController.getEvents);
router.get('/events/:id', EventController.getEventById);
router.post('/events/:id/reset', EventController.resetEvent);
router.put('/events/sub-events/:id', EventController.updateSubEvent);
router.post('/events/tasks', EventController.addTask);
router.put('/events/tasks/:id', EventController.updateTask);
router.put('/events/vendors/:id', EventController.updateVendor);
router.put('/events/:eventId/logistics', EventController.updateLogistics);

// Chat
router.post('/chat', ChatController.sendMessage);
router.get('/chat/:eventId', ChatController.getMessages);

// Risks & 1-Click Actions
router.get('/risks/:eventId', RiskController.getRisks);
router.post('/risks/resolve', RiskController.resolveRisk);
router.post('/risks/action', RiskController.executeAction);

export default router;
