import { Request, Response } from 'express';
import { store } from '../models/store';
import { AIService } from '../services/aiService';
import { RiskEngine } from '../services/riskEngine';
import { IChatMessage } from '../types';

export class ChatController {
  public static async sendMessage(req: Request, res: Response) {
    try {
      const { eventId, message } = req.body;

      if (!eventId || !message) {
        return res.status(400).json({ success: false, message: 'eventId and message are required' });
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 1. Record User Message
      const userMessage: IChatMessage = {
        id: `msg_usr_${Date.now()}`,
        eventId,
        sender: 'user',
        text: message,
        timestamp,
      };
      store.addChatMessage(userMessage);

      // 2. Process through AI Service
      const aiResult = await AIService.processMessage(eventId, message);

      // 3. Record AI Response
      const aiMessage: IChatMessage = {
        id: `msg_ai_${Date.now()}`,
        eventId,
        sender: 'ai',
        text: aiResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extractedEntities: aiResult.extractedEntities,
        suggestedActions: aiResult.suggestedActions,
      };
      store.addChatMessage(aiMessage);

      // 4. Re-evaluate risks and metrics
      RiskEngine.evaluateEventRisks(eventId);
      store.recalculateEventMetrics(eventId);

      // 5. Return updated snapshot
      const snapshot = store.getEventSnapshot(eventId);

      return res.json({
        success: true,
        aiMessage,
        ...snapshot,
      });
    } catch (error: any) {
      console.error('Chat processing error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during chat processing',
        error: error.message,
      });
    }
  }

  public static getMessages(req: Request, res: Response) {
    const { eventId } = req.params;
    const messages = store.getChatMessages(eventId);
    return res.json({ success: true, messages });
  }
}
