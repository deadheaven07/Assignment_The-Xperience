import { Request, Response } from 'express';
import { store } from '../models/store';
import { RiskEngine } from '../services/riskEngine';

export class EventController {
  public static getEvents(req: Request, res: Response) {
    const events = store.getAllEvents();
    return res.json({ success: true, events });
  }

  public static getEventById(req: Request, res: Response) {
    const { id } = req.params;
    RiskEngine.evaluateEventRisks(id);
    const snapshot = store.getEventSnapshot(id);

    if (!snapshot.event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.json({ success: true, ...snapshot });
  }

  public static resetEvent(req: Request, res: Response) {
    const { id } = req.params;
    store.resetEvent(id);
    RiskEngine.evaluateEventRisks(id);
    const snapshot = store.getEventSnapshot(id);

    return res.json({
      success: true,
      message: 'Event reset to initial assessment seed state.',
      ...snapshot,
    });
  }

  public static updateSubEvent(req: Request, res: Response) {
    const { id } = req.params;
    const updated = store.updateSubEvent(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Sub-event not found' });
    }
    return res.json({ success: true, subEvent: updated });
  }

  public static updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const updated = store.updateTask(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.json({ success: true, task: updated });
  }

  public static addTask(req: Request, res: Response) {
    const { eventId, title, category, priority, assignee, dueDate, estimatedCost } = req.body;
    const newTask = {
      id: `tsk_${Date.now()}`,
      eventId,
      title,
      category: category || 'general',
      status: 'todo' as const,
      priority: priority || 'medium',
      assignee: assignee || 'Unassigned',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      estimatedCost: estimatedCost || 0,
    };
    store.addTask(newTask);
    return res.json({ success: true, task: newTask });
  }

  public static updateVendor(req: Request, res: Response) {
    const { id } = req.params;
    const updated = store.updateVendor(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    return res.json({ success: true, vendor: updated });
  }

  public static updateLogistics(req: Request, res: Response) {
    const { eventId } = req.params;
    const updated = store.updateLogistics(eventId, req.body);
    RiskEngine.evaluateEventRisks(eventId);
    return res.json({ success: true, logistics: updated });
  }
}
