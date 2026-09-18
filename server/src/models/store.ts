import {
  IEvent,
  ISubEvent,
  ITask,
  IVendor,
  ILogistics,
  IRiskAlert,
  IChatMessage,
  IUser,
  IAuditLogEntry,
  INotification,
  IWhatIfSimulation,
  IDailyBriefing,
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_SUB_EVENTS,
  INITIAL_TASKS,
  INITIAL_VENDORS,
  INITIAL_LOGISTICS,
  INITIAL_RISKS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_USER,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  WEDDING_EVENT_ID,
  CORPORATE_EVENT_ID,
} from '../services/seedData';

class AppDataStore {
  private user: IUser = { ...INITIAL_USER };
  private events: Map<string, IEvent> = new Map();
  private subEvents: Map<string, ISubEvent> = new Map();
  private tasks: Map<string, ITask> = new Map();
  private vendors: Map<string, IVendor> = new Map();
  private logistics: Map<string, ILogistics> = new Map();
  private risks: Map<string, IRiskAlert> = new Map();
  private chatMessages: Map<string, IChatMessage[]> = new Map();
  private auditLogs: Map<string, IAuditLogEntry> = new Map();
  private notifications: Map<string, INotification> = new Map();

  constructor() {
    this.resetAll();
  }

  public resetAll() {
    this.events.clear();
    this.subEvents.clear();
    this.tasks.clear();
    this.vendors.clear();
    this.logistics.clear();
    this.risks.clear();
    this.chatMessages.clear();
    this.auditLogs.clear();
    this.notifications.clear();

    INITIAL_EVENTS.forEach((e) => this.events.set(e.id, { ...e }));
    INITIAL_SUB_EVENTS.forEach((se) => this.subEvents.set(se.id, { ...se }));
    INITIAL_TASKS.forEach((t) => this.tasks.set(t.id, { ...t }));
    INITIAL_VENDORS.forEach((v) => this.vendors.set(v.id, { ...v }));
    INITIAL_LOGISTICS.forEach((l) => this.logistics.set(l.eventId, { ...l }));
    INITIAL_RISKS.forEach((r) => this.risks.set(r.id, { ...r }));
    INITIAL_AUDIT_LOGS.forEach((a) => this.auditLogs.set(a.id, { ...a }));
    INITIAL_NOTIFICATIONS.forEach((n) => this.notifications.set(n.id, { ...n }));

    Object.entries(INITIAL_CHAT_MESSAGES).forEach(([evtId, msgs]) => {
      this.chatMessages.set(evtId, msgs.map((m) => ({ ...m })));
    });

    this.evaluateTaskDependencies(WEDDING_EVENT_ID);
    this.evaluateTaskDependencies(CORPORATE_EVENT_ID);

    this.recalculateEventMetrics(WEDDING_EVENT_ID);
    this.recalculateEventMetrics(CORPORATE_EVENT_ID);
  }

  public resetEvent(eventId: string) {
    const seedEvent = INITIAL_EVENTS.find((e) => e.id === eventId);
    if (seedEvent) this.events.set(eventId, { ...seedEvent });

    // Reset sub-events
    Array.from(this.subEvents.values())
      .filter((se) => se.eventId === eventId)
      .forEach((se) => this.subEvents.delete(se.id));
    INITIAL_SUB_EVENTS.filter((se) => se.eventId === eventId).forEach((se) =>
      this.subEvents.set(se.id, { ...se })
    );

    // Reset tasks
    Array.from(this.tasks.values())
      .filter((t) => t.eventId === eventId)
      .forEach((t) => this.tasks.delete(t.id));
    INITIAL_TASKS.filter((t) => t.eventId === eventId).forEach((t) =>
      this.tasks.set(t.id, { ...t })
    );

    // Reset vendors
    Array.from(this.vendors.values())
      .filter((v) => v.eventId === eventId)
      .forEach((v) => this.vendors.delete(v.id));
    INITIAL_VENDORS.filter((v) => v.eventId === eventId).forEach((v) =>
      this.vendors.set(v.id, { ...v })
    );

    // Reset logistics
    const seedLogistics = INITIAL_LOGISTICS.find((l) => l.eventId === eventId);
    if (seedLogistics) this.logistics.set(eventId, { ...seedLogistics });

    // Reset risks
    Array.from(this.risks.values())
      .filter((r) => r.eventId === eventId)
      .forEach((r) => this.risks.delete(r.id));
    INITIAL_RISKS.filter((r) => r.eventId === eventId).forEach((r) =>
      this.risks.set(r.id, { ...r })
    );

    // Reset chat
    const seedChat = INITIAL_CHAT_MESSAGES[eventId] || [];
    this.chatMessages.set(
      eventId,
      seedChat.map((m) => ({ ...m }))
    );

    this.recalculateEventMetrics(eventId);
  }

  // User
  public getUser(): IUser {
    return this.user;
  }

  // Events
  public getAllEvents(): IEvent[] {
    return Array.from(this.events.values());
  }

  public getEvent(id: string): IEvent | undefined {
    return this.events.get(id);
  }

  public updateEvent(id: string, updates: Partial<IEvent>): IEvent | undefined {
    const existing = this.events.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.events.set(id, updated);
    return updated;
  }

  // Sub-Events
  public getSubEvents(eventId: string): ISubEvent[] {
    return Array.from(this.subEvents.values())
      .filter((se) => se.eventId === eventId)
      .sort((a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime));
  }

  public addSubEvent(subEvent: ISubEvent): ISubEvent {
    this.subEvents.set(subEvent.id, subEvent);
    this.recalculateEventMetrics(subEvent.eventId);
    return subEvent;
  }

  public updateSubEvent(id: string, updates: Partial<ISubEvent>): ISubEvent | undefined {
    const existing = this.subEvents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.subEvents.set(id, updated);
    this.recalculateEventMetrics(updated.eventId);
    return updated;
  }

  // Dependency Graph Evaluation
  public evaluateTaskDependencies(eventId: string) {
    const tasks = Array.from(this.tasks.values()).filter((t) => t.eventId === eventId);
    const taskMap = new Map(tasks.map((t) => [t.id, t]));

    for (const task of tasks) {
      if (task.dependsOn && task.dependsOn.length > 0) {
        const unfinishedBlockers = task.dependsOn.filter((depId) => {
          const parent = taskMap.get(depId);
          return !parent || parent.status !== 'done';
        });

        const isNowBlocked = unfinishedBlockers.length > 0;
        const changed = task.isBlocked !== isNowBlocked || JSON.stringify(task.blockedBy) !== JSON.stringify(unfinishedBlockers);

        if (changed) {
          task.isBlocked = isNowBlocked;
          task.blockedBy = unfinishedBlockers;
          if (isNowBlocked && task.status !== 'done') {
            task.status = 'blocked';
          } else if (!isNowBlocked && task.status === 'blocked') {
            task.status = 'todo';
          }
          this.tasks.set(task.id, { ...task });
        }
      } else if (task.isBlocked) {
        task.isBlocked = false;
        task.blockedBy = [];
        if (task.status === 'blocked') task.status = 'todo';
        this.tasks.set(task.id, { ...task });
      }
    }
  }

  // Tasks
  public getTasks(eventId: string): ITask[] {
    return Array.from(this.tasks.values()).filter((t) => t.eventId === eventId);
  }

  public addTask(task: ITask): ITask {
    this.tasks.set(task.id, task);
    this.evaluateTaskDependencies(task.eventId);
    this.recalculateEventMetrics(task.eventId);
    this.addAuditLog({
      eventId: task.eventId,
      actor: this.user.name,
      actionType: 'TASK_CREATED',
      entityType: 'task',
      entityId: task.id,
      description: `Task created: "${task.title}" (Status: ${task.status})`,
      newValue: task,
      ruleEvaluated: 'Task Dependency & SLA Guard',
      validationStatus: 'approved',
    });
    return task;
  }

  public updateTask(id: string, updates: Partial<ITask>): ITask | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const oldStatus = existing.status;
    const updated = { ...existing, ...updates };
    this.tasks.set(id, updated);
    this.evaluateTaskDependencies(updated.eventId);
    this.recalculateEventMetrics(updated.eventId);

    if (updates.status && updates.status !== oldStatus) {
      this.addAuditLog({
        eventId: updated.eventId,
        actor: this.user.name,
        actionType: 'TASK_STATUS_CHANGED',
        entityType: 'task',
        entityId: id,
        description: `Task "${updated.title}" transitioned from ${oldStatus} to ${updates.status}.`,
        previousValue: { status: oldStatus },
        newValue: { status: updates.status },
        ruleEvaluated: 'Task Dependency & Blocker Guard',
        validationStatus: 'approved',
      });
    }

    return updated;
  }

  public deleteTask(id: string): boolean {
    const existing = this.tasks.get(id);
    if (!existing) return false;
    const eventId = existing.eventId;
    this.tasks.delete(id);
    this.evaluateTaskDependencies(eventId);
    this.recalculateEventMetrics(eventId);
    this.addAuditLog({
      eventId,
      actor: this.user.name,
      actionType: 'TASK_DELETED',
      entityType: 'task',
      entityId: id,
      description: `Task deleted: "${existing.title}".`,
      previousValue: existing,
      ruleEvaluated: 'Task Dependency Guard',
      validationStatus: 'approved',
    });
    return true;
  }

  // Vendors
  public getVendors(eventId: string): IVendor[] {
    return Array.from(this.vendors.values()).filter((v) => v.eventId === eventId);
  }

  public addVendor(vendor: IVendor): IVendor {
    this.vendors.set(vendor.id, vendor);
    this.recalculateEventMetrics(vendor.eventId);
    return vendor;
  }

  public updateVendor(id: string, updates: Partial<IVendor>): IVendor | undefined {
    const existing = this.vendors.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.vendors.set(id, updated);
    this.recalculateEventMetrics(updated.eventId);
    return updated;
  }

  // Logistics
  public getLogistics(eventId: string): ILogistics | undefined {
    return this.logistics.get(eventId);
  }

  public updateLogistics(eventId: string, updates: Partial<ILogistics>): ILogistics {
    const existing = this.logistics.get(eventId) || {
      id: `log_${eventId}`,
      eventId,
      outOfTownGuests: 0,
      hotelRoomsRequired: 0,
      hotelRoomsBooked: 0,
      airportShuttlesRequired: 0,
      airportShuttlesAssigned: 0,
      fleetCapacityRequired: 0,
      fleetCapacityAllocated: 0,
    };
    const updated = { ...existing, ...updates };
    this.logistics.set(eventId, updated);
    this.recalculateEventMetrics(eventId);
    return updated;
  }

  // Risks
  public getRisks(eventId: string): IRiskAlert[] {
    return Array.from(this.risks.values())
      .filter((r) => r.eventId === eventId && !r.resolved)
      .sort((a, b) => (a.severity === 'critical' ? -1 : 1));
  }

  public getAllRisks(eventId: string): IRiskAlert[] {
    return Array.from(this.risks.values()).filter((r) => r.eventId === eventId);
  }

  public addRisk(risk: IRiskAlert): IRiskAlert {
    this.risks.set(risk.id, risk);
    this.recalculateEventMetrics(risk.eventId);
    return risk;
  }

  public resolveRisk(riskId: string): IRiskAlert | undefined {
    const existing = this.risks.get(riskId);
    if (!existing) return undefined;
    const updated = { ...existing, resolved: true };
    this.risks.set(riskId, updated);
    this.recalculateEventMetrics(existing.eventId);
    return updated;
  }

  // Chat
  public getChatMessages(eventId: string): IChatMessage[] {
    return this.chatMessages.get(eventId) || [];
  }

  public addChatMessage(message: IChatMessage): IChatMessage {
    const list = this.chatMessages.get(message.eventId) || [];
    list.push(message);
    this.chatMessages.set(message.eventId, list);
    return message;
  }

  // Metric Recalculation
  public recalculateEventMetrics(eventId: string) {
    const event = this.events.get(eventId);
    if (!event) return;

    const vendors = this.getVendors(eventId);
    const confirmedCount = vendors.filter((v) => v.status === 'confirmed' || v.status === 'contract_signed').length;
    const activeRisks = this.getRisks(eventId);

    const tasks = this.getTasks(eventId);
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const taskRatio = tasks.length > 0 ? (doneTasks / tasks.length) * 40 : 20;

    const vendorRatio = vendors.length > 0 ? (confirmedCount / vendors.length) * 40 : 20;
    const riskPenalty = activeRisks.filter((r) => r.severity === 'critical').length * 15 +
      activeRisks.filter((r) => r.severity === 'warning').length * 5;

    let score = Math.round(20 + taskRatio + vendorRatio - riskPenalty);
    score = Math.max(10, Math.min(100, score));

    const totalSpend = vendors.reduce((sum, v) => sum + (v.status !== 'gap' ? v.cost : 0), 0);

    this.events.set(eventId, {
      ...event,
      readinessScore: score,
      confirmedVendorsCount: confirmedCount,
      totalVendorsCount: vendors.length,
      activeRisksCount: activeRisks.length,
      spent: totalSpend,
    });
  }

  // Audit Logs
  public addAuditLog(entry: Omit<IAuditLogEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): IAuditLogEntry {
    const log: IAuditLogEntry = {
      id: entry.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.set(log.id, log);
    return log;
  }

  public getAuditLogs(eventId?: string): IAuditLogEntry[] {
    const list = Array.from(this.auditLogs.values());
    if (eventId) {
      return list.filter((l) => l.eventId === eventId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // Notifications
  public addNotification(notif: Omit<INotification, 'id' | 'timestamp' | 'read'> & { id?: string; timestamp?: string; read?: boolean }): INotification {
    const item: INotification = {
      id: notif.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: notif.timestamp || 'Just now',
      read: notif.read ?? false,
      ...notif,
    };
    this.notifications.set(item.id, item);
    return item;
  }

  public getNotifications(eventId?: string): INotification[] {
    const list = Array.from(this.notifications.values());
    if (eventId) {
      return list.filter((n) => n.eventId === eventId);
    }
    return list;
  }

  public markNotificationRead(id: string): INotification | undefined {
    const existing = this.notifications.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, read: true };
    this.notifications.set(id, updated);
    return updated;
  }

  public markAllNotificationsRead(eventId?: string) {
    for (const [id, notif] of this.notifications.entries()) {
      if (!eventId || notif.eventId === eventId) {
        this.notifications.set(id, { ...notif, read: true });
      }
    }
  }

  // What-If Scenario Simulation
  public simulateWhatIf(eventId: string, guestDelta: number, indoorShift: boolean): IWhatIfSimulation {
    const event = this.getEvent(eventId);
    const logistics = this.getLogistics(eventId);
    const currentGuests = event ? event.totalGuests : 400;
    const projectedGuests = Math.max(10, currentGuests + guestDelta);
    const perPlateRate = event?.type === 'wedding' ? 3500 : 2000;
    const cateringVariance = guestDelta * perPlateRate;
    const weatherVariance = indoorShift ? (event?.type === 'wedding' ? 150000 : 75000) : 0;
    const budgetVariance = cateringVariance + weatherVariance;
    const currentBudget = event ? event.budget : 4500000;
    const currentSpent = event ? event.spent : 3150000;
    const projectedTotalCost = currentSpent + budgetVariance;

    const warnings: string[] = [];
    const recommendedAdjustments: string[] = [];

    if (projectedTotalCost > currentBudget) {
      warnings.push(`Projected spend (₹${projectedTotalCost.toLocaleString('en-IN')}) exceeds total budget by ₹${(projectedTotalCost - currentBudget).toLocaleString('en-IN')}.`);
      recommendedAdjustments.push('Reallocate contingency reserve or request client budget expansion.');
    }

    if (guestDelta > 40) {
      warnings.push(`Additional ${guestDelta} guests require ${Math.ceil(guestDelta / 10)} extra dining roundtables & 2 more steward stations.`);
      recommendedAdjustments.push('Alert catering and banquet team 48 hours in advance for expanded service line.');
    }

    if (indoorShift) {
      warnings.push('Moving open-air lawn segments indoors reduces available acoustic throw and requires ballroom sound dampening.');
      recommendedAdjustments.push('Trigger Rain Contingency protocol: reroute baraat procession and sound systems into indoor grand ballroom.');
    }

    const capacityDeficit = logistics ? Math.max(0, projectedGuests - logistics.fleetCapacityAllocated) : 0;
    if (capacityDeficit > 0) {
      warnings.push(`Transport shortfall of ${capacityDeficit} passenger seats.`);
      recommendedAdjustments.push(`Contract ${Math.ceil(capacityDeficit / 25)} additional 25-seater shuttles.`);
    }

    let feasibilityScore = 95;
    if (projectedTotalCost > currentBudget) feasibilityScore -= 25;
    if (indoorShift) feasibilityScore -= 15;
    if (guestDelta > 50) feasibilityScore -= 15;
    feasibilityScore = Math.max(20, Math.min(100, feasibilityScore));

    return {
      eventId,
      scenarioName: `${guestDelta >= 0 ? '+' : ''}${guestDelta} Guests ${indoorShift ? '& Rain Contingency Indoor Shift' : 'Adjustment'}`,
      guestDelta,
      indoorShift,
      projectedBudgetVariance: budgetVariance,
      projectedReadinessScore: Math.max(30, (event?.readinessScore || 80) - (feasibilityScore < 70 ? 10 : 0)),
      feasibilityScore,
      warnings,
      recommendedAdjustments,
      timestamp: new Date().toISOString(),
    };
  }

  // Executive Daily Briefing Generation
  public generateDailyBriefing(eventId: string): IDailyBriefing {
    const event = this.getEvent(eventId);
    const tasks = this.getTasks(eventId);
    const risks = this.getRisks(eventId);

    const blockedTasks = tasks.filter((t) => t.isBlocked || t.status === 'blocked');
    const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done');
    const criticalRisks = risks.filter((r) => r.severity === 'critical');

    const today = new Date();
    const eventStart = event ? new Date(event.startDate) : new Date();
    const daysUntil = Math.max(0, Math.ceil((eventStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    const briefing: IDailyBriefing = {
      eventId,
      date: new Date().toISOString().split('T')[0],
      executiveSummary: `Executive briefing for ${event?.title || 'Event'}: T-${daysUntil} days to kickoff. Overall readiness is at ${event?.readinessScore || 80}%. Total budget allocated is ₹${((event?.budget || 0) / 100000).toFixed(1)}L with ₹${((event?.spent || 0) / 100000).toFixed(1)}L committed (${Math.round(((event?.spent || 0) / (event?.budget || 1)) * 100)}% utilized).`,
      keyRisks: risks.map((r) => `${r.severity.toUpperCase()}: ${r.title} — ${r.impact}`),
      urgentActions: [
        ...urgentTasks.map((t) => `Urgent Task: ${t.title} (Assigned to: ${t.assignee}, Due: ${t.dueDate})`),
        ...blockedTasks.map((t) => `Dependency Blocker: ${t.title} is awaiting parent completion (${t.blockedBy?.join(', ') || 'prerequisite'}).`),
        ...criticalRisks.flatMap((r) => r.recommendedActions.map((a) => `Risk Action: ${a.label}`)),
      ],
      milestoneCountdowns: [
        { milestone: 'Event Kickoff & Guest Welcome', daysRemaining: daysUntil, status: daysUntil <= 7 ? 'critical' : 'on_track' },
        { milestone: 'Final Vendor Lock & Payments', daysRemaining: Math.max(0, daysUntil - 5), status: 'on_track' },
        { milestone: 'Catering Headcount Final Lock', daysRemaining: Math.max(0, daysUntil - 7), status: 'warning' },
      ],
      generatedAt: new Date().toISOString(),
    };

    return briefing;
  }

  // Complete Snapshot for Dashboard
  public getEventSnapshot(eventId: string) {
    this.recalculateEventMetrics(eventId);
    return {
      event: this.getEvent(eventId),
      subEvents: this.getSubEvents(eventId),
      tasks: this.getTasks(eventId),
      vendors: this.getVendors(eventId),
      logistics: this.getLogistics(eventId),
      risks: this.getRisks(eventId),
      chatMessages: this.getChatMessages(eventId),
      auditLogs: this.getAuditLogs(eventId).slice(0, 25),
      notifications: this.getNotifications(eventId),
    };
  }
}

export const store = new AppDataStore();
