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
    const { eventId, title, category, priority, assignee, dueDate, estimatedCost, dependsOn } = req.body;
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
      dependsOn: dependsOn || [],
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

  public static updateEvent(req: Request, res: Response) {
    const { id } = req.params;
    const updated = store.updateEvent(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    store.recalculateEventMetrics(id);
    RiskEngine.evaluateEventRisks(id);
    const snapshot = store.getEventSnapshot(id);
    return res.json({ success: true, ...snapshot });
  }

  public static addVendor(req: Request, res: Response) {
    const { eventId } = req.params;
    const { name, category, cost, contactName, phone, email, notes, assignedSubEvents } = req.body;
    const newVendor = {
      id: `vnd_${Date.now()}`,
      eventId,
      name: name || 'New Partner Vendor',
      category: category || 'decor',
      status: 'confirmed' as const,
      cost: Number(cost) || 0,
      contactName: contactName || 'Partner Representative',
      phone: phone || '+91 98765 00000',
      email: email || 'partner@thexperience.ai',
      notes: notes || '',
      assignedSubEvents: assignedSubEvents || [],
    };
    store.addVendor(newVendor);
    RiskEngine.evaluateEventRisks(eventId);
    return res.json({ success: true, vendor: newVendor });
  }

  public static updateLogistics(req: Request, res: Response) {
    const { eventId } = req.params;
    const updated = store.updateLogistics(eventId, req.body);
    RiskEngine.evaluateEventRisks(eventId);
    return res.json({ success: true, logistics: updated });
  }

  public static getAuditLogs(req: Request, res: Response) {
    const { id } = req.params;
    const logs = store.getAuditLogs(id);
    return res.json({ success: true, auditLogs: logs });
  }

  public static getNotifications(req: Request, res: Response) {
    const { eventId } = req.query;
    const notifications = store.getNotifications(eventId ? String(eventId) : undefined);
    return res.json({ success: true, notifications });
  }

  public static markNotificationRead(req: Request, res: Response) {
    const { id } = req.params;
    const updated = store.markNotificationRead(id);
    return res.json({ success: true, notification: updated });
  }

  public static markAllNotificationsRead(req: Request, res: Response) {
    const { eventId } = req.body;
    store.markAllNotificationsRead(eventId);
    return res.json({ success: true, message: 'All notifications marked as read' });
  }

  public static simulateWhatIf(req: Request, res: Response) {
    const { id } = req.params;
    const { guestDelta = 0, indoorShift = false } = req.body;
    const simulation = store.simulateWhatIf(id, Number(guestDelta), Boolean(indoorShift));
    return res.json({ success: true, simulation });
  }

  public static generateDailyBriefing(req: Request, res: Response) {
    const { id } = req.params;
    const briefing = store.generateDailyBriefing(id);
    return res.json({ success: true, briefing });
  }
}
