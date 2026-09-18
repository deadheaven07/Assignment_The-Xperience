import { Request, Response } from 'express';
import { store } from '../models/store';
import { RiskEngine } from '../services/riskEngine';

export class RiskController {
  public static getRisks(req: Request, res: Response) {
    const { eventId } = req.params;
    RiskEngine.evaluateEventRisks(eventId);
    const risks = store.getRisks(eventId);
    return res.json({ success: true, risks });
  }

  public static resolveRisk(req: Request, res: Response) {
    const { riskId } = req.body;
    const resolved = store.resolveRisk(riskId);
    if (!resolved) {
      return res.status(404).json({ success: false, message: 'Risk not found' });
    }
    const snapshot = store.getEventSnapshot(resolved.eventId);
    return res.json({ success: true, message: 'Risk resolved', ...snapshot });
  }

  public static executeAction(req: Request, res: Response) {
    const { actionType, payload } = req.body;

    if (!actionType || !payload || !payload.eventId) {
      return res.status(400).json({ success: false, message: 'actionType and payload.eventId are required' });
    }

    const result = RiskEngine.executeAction(actionType, payload);
    RiskEngine.evaluateEventRisks(payload.eventId);
    const snapshot = store.getEventSnapshot(payload.eventId);

    return res.json({
      success: result.success,
      message: result.message,
      ...snapshot,
    });
  }
}
