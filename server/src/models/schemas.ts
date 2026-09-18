import mongoose, { Schema, Document } from 'mongoose';
import { IEvent, ISubEvent, ITask, IVendor, ILogistics, IAuditLogEntry, INotification } from '../types';

// Event Schema
export interface IEventDoc extends IEvent, Document {
  id: string;
}

export const EventSchema = new Schema<IEventDoc>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['wedding', 'corporate'], required: true },
    description: { type: String, default: '' },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    location: { type: String, required: true },
    totalGuests: { type: Number, required: true },
    budget: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 80 },
    confirmedVendorsCount: { type: Number, default: 0 },
    totalVendorsCount: { type: Number, default: 0 },
    activeRisksCount: { type: Number, default: 0 },
    lifecycleStage: {
      type: String,
      enum: ['planning', 'vendor_confirmation', 'execution', 'contingency_handling'],
      default: 'planning',
    },
  },
  { timestamps: true }
);

// Task Schema
export interface ITaskDoc extends ITask, Document {
  id: string;
}

export const TaskSchema = new Schema<ITaskDoc>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['todo', 'in_progress', 'blocked', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    assignee: { type: String, default: 'Unassigned' },
    dueDate: { type: String, required: true },
    estimatedCost: { type: Number, default: 0 },
    dependsOn: [{ type: String }],
    isBlocked: { type: Boolean, default: false },
    blockedBy: [{ type: String }],
  },
  { timestamps: true }
);

// Vendor Schema
export interface IVendorDoc extends IVendor, Document {
  id: string;
}

export const VendorSchema = new Schema<IVendorDoc>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'shortlisted', 'gap', 'contract_signed', 'under_review'],
      default: 'confirmed',
    },
    cost: { type: Number, default: 0 },
    contactName: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    notes: { type: String, default: '' },
    assignedSubEvents: [{ type: String }],
  },
  { timestamps: true }
);

// Logistics Schema
export interface ILogisticsDoc extends ILogistics, Document {
  id: string;
}

export const LogisticsSchema = new Schema<ILogisticsDoc>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true, index: true },
    outOfTownGuests: { type: Number, default: 0 },
    hotelRoomsRequired: { type: Number, default: 0 },
    hotelRoomsBooked: { type: Number, default: 0 },
    airportShuttlesRequired: { type: Number, default: 0 },
    airportShuttlesAssigned: { type: Number, default: 0 },
    fleetCapacityRequired: { type: Number, default: 0 },
    fleetCapacityAllocated: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Audit Log Schema
export interface IAuditLogDoc extends IAuditLogEntry, Document {
  id: string;
}

export const AuditLogSchema = new Schema<IAuditLogDoc>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true, index: true },
    timestamp: { type: String, required: true },
    actor: { type: String, required: true },
    actionType: { type: String, required: true },
    description: { type: String, required: true },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Notification Schema
export interface INotificationDoc extends INotification, Document {
  id: string;
}

export const NotificationSchema = new Schema<INotificationDoc>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['crisis', 'action_resolved', 'deadline', 'system'], default: 'system' },
    read: { type: Boolean, default: false },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export const EventModel = mongoose.models.Event || mongoose.model<IEventDoc>('Event', EventSchema);
export const TaskModel = mongoose.models.Task || mongoose.model<ITaskDoc>('Task', TaskSchema);
export const VendorModel = mongoose.models.Vendor || mongoose.model<IVendorDoc>('Vendor', VendorSchema);
export const LogisticsModel = mongoose.models.Logistics || mongoose.model<ILogisticsDoc>('Logistics', LogisticsSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<IAuditLogDoc>('AuditLog', AuditLogSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model<INotificationDoc>('Notification', NotificationSchema);
