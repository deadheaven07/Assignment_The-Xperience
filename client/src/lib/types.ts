export type EventType = 'wedding' | 'corporate';
export type SubEventStatus = 'upcoming' | 'ongoing' | 'completed' | 'delayed';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'decor' | 'catering' | 'logistics' | 'photography' | 'entertainment' | 'hospitality' | 'general';
export type VendorStatus = 'confirmed' | 'shortlisted' | 'gap' | 'contract_signed' | 'under_review';
export type VendorCategory = 'venue' | 'decor' | 'catering' | 'photography' | 'entertainment' | 'transportation' | 'hospitality';
export type RiskSeverity = 'critical' | 'warning' | 'info';
export type DiscrepancyType = 'capacity_deficit' | 'vendor_gap' | 'deadline' | 'budget_overrun' | 'schedule_conflict';

export interface ISubEvent {
  id: string;
  eventId: string;
  title: string;
  day: number;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  expectedGuests: number;
  status: SubEventStatus;
  notes?: string;
}

export interface ITask {
  id: string;
  eventId: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  estimatedCost?: number;
  dependsOn?: string[];
  isBlocked?: boolean;
  blockedBy?: string[];
}

export interface IVendor {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  cost: number;
  contactName: string;
  phone: string;
  email: string;
  notes?: string;
  assignedSubEvents: string[];
}

export interface ILogistics {
  id: string;
  eventId: string;
  outOfTownGuests: number;
  hotelRoomsRequired: number;
  hotelRoomsBooked: number;
  airportShuttlesRequired: number;
  airportShuttlesAssigned: number;
  fleetCapacityRequired: number;
  fleetCapacityAllocated: number;
  notes?: string;
}

export interface IRiskAction {
  id: string;
  label: string;
  actionType: string;
  payload: Record<string, any>;
  estimatedCost?: number;
  confidence?: number;
}

export interface IRiskAlert {
  id: string;
  eventId: string;
  title: string;
  severity: RiskSeverity;
  type: DiscrepancyType;
  message: string;
  impact: string;
  resolved: boolean;
  recommendedActions: IRiskAction[];
  createdAt: string;
  riskScore?: number;
  impactAnalysis?: string;
  estimatedCost?: number;
  financialImpact?: number;
  operationalImpact?: string;
  confidence?: number;
}

export type EventLifecycleStage = 'planning' | 'vendor_confirmation' | 'execution' | 'contingency_handling';

export interface IEvent {
  id: string;
  title: string;
  type: EventType;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  totalGuests: number;
  budget: number;
  spent: number;
  readinessScore: number;
  confirmedVendorsCount: number;
  totalVendorsCount: number;
  activeRisksCount: number;
  lifecycleStage?: EventLifecycleStage;
}

export interface IChatMessage {
  id: string;
  eventId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  extractedEntities?: {
    dates?: string[];
    headcounts?: number[];
    vendors?: string[];
    subEvents?: string[];
    actions?: string[];
  };
  suggestedActions?: {
    id: string;
    label: string;
    actionType: string;
    payload?: Record<string, any>;
  }[];
  intent?: string;
  confidence?: number;
  reasoning?: string;
  validationStatus?: 'valid' | 'guarded' | 'rejected';
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IAuditLogEntry {
  id: string;
  eventId: string;
  timestamp: string;
  actor: string;
  actionType: string;
  description: string;
  entityType?: string;
  entityId?: string;
  previousValue?: any;
  newValue?: any;
  ruleEvaluated?: string;
  validationStatus?: string;
  metadata?: Record<string, any>;
}

export interface INotification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: 'crisis' | 'action_resolved' | 'deadline' | 'system' | 'warning' | 'error' | 'info';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface IWhatIfSimulation {
  eventId?: string;
  scenarioName: string;
  guestDelta: number;
  indoorShift?: boolean;
  additionalCateringCost?: number;
  additionalRoomsNeeded?: number;
  additionalBusSeatsNeeded?: number;
  budgetVariance?: number;
  projectedBudgetVariance?: number;
  newProjectedReadiness?: number;
  projectedReadinessScore?: number;
  feasibilityScore?: number;
  warnings?: string[];
  recommendedAdjustments?: string[];
  recommendations?: string[];
  timestamp?: string;
}

export interface IDailyBriefing {
  eventId: string;
  eventTitle?: string;
  date?: string;
  generatedAt: string;
  executiveSummary: string;
  keyRisks?: string[];
  urgentActions?: string[];
  milestoneCountdowns?: { milestone: string; daysRemaining: number; status: string }[];
  todaySubEvents?: { title: string; time: string; venue: string; guests: number }[];
  blockedTasks?: { title: string; priority: string; blockedBy: string[] }[];
  supplierDeadlines?: { vendorName: string; deadline: string; description: string }[];
  transitStatus?: string;
  healthReadiness?: number;
}

export interface IEventSnapshot {
  event: IEvent;
  subEvents: ISubEvent[];
  tasks: ITask[];
  vendors: IVendor[];
  logistics: ILogistics;
  risks: IRiskAlert[];
  chatMessages: IChatMessage[];
  auditLogs?: IAuditLogEntry[];
  notifications?: INotification[];
}
