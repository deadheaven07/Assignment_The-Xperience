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
}

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
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IEventSnapshot {
  event: IEvent;
  subEvents: ISubEvent[];
  tasks: ITask[];
  vendors: IVendor[];
  logistics: ILogistics;
  risks: IRiskAlert[];
  chatMessages: IChatMessage[];
}
