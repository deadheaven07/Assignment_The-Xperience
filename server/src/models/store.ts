import {
  IEvent,
  ISubEvent,
  ITask,
  IVendor,
  ILogistics,
  IRiskAlert,
  IChatMessage,
  IUser,
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

    INITIAL_EVENTS.forEach((e) => this.events.set(e.id, { ...e }));
    INITIAL_SUB_EVENTS.forEach((se) => this.subEvents.set(se.id, { ...se }));
    INITIAL_TASKS.forEach((t) => this.tasks.set(t.id, { ...t }));
    INITIAL_VENDORS.forEach((v) => this.vendors.set(v.id, { ...v }));
    INITIAL_LOGISTICS.forEach((l) => this.logistics.set(l.eventId, { ...l }));
    INITIAL_RISKS.forEach((r) => this.risks.set(r.id, { ...r }));

    Object.entries(INITIAL_CHAT_MESSAGES).forEach(([evtId, msgs]) => {
      this.chatMessages.set(evtId, msgs.map((m) => ({ ...m })));
    });

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

  // Tasks
  public getTasks(eventId: string): ITask[] {
    return Array.from(this.tasks.values()).filter((t) => t.eventId === eventId);
  }

  public addTask(task: ITask): ITask {
    this.tasks.set(task.id, task);
    this.recalculateEventMetrics(task.eventId);
    return task;
  }

  public updateTask(id: string, updates: Partial<ITask>): ITask | undefined {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.tasks.set(id, updated);
    this.recalculateEventMetrics(updated.eventId);
    return updated;
  }

  public deleteTask(id: string): boolean {
    const existing = this.tasks.get(id);
    if (!existing) return false;
    const eventId = existing.eventId;
    this.tasks.delete(id);
    this.recalculateEventMetrics(eventId);
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
    };
  }
}

export const store = new AppDataStore();
