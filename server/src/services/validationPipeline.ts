import { store } from '../models/store';
import { ITask, IEvent, IAuditLogEntry } from '../types';

export type EventIntentType =
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'RESCHEDULE_SUB_EVENT'
  | 'FLAG_VENDOR_GAP'
  | 'CONFIRM_VENDOR'
  | 'MODIFY_CAPACITY'
  | 'REALLOCATE_BUDGET'
  | 'LOG_CONTINGENCY'
  | 'GENERAL_QUERY';

export interface ValidationResult {
  isValid: boolean;
  violations: string[];
  intent: EventIntentType;
  confidence: number;
  explanation: string;
  sanitizedPayload?: Record<string, any>;
}

export class EventValidationPipeline {
  /**
   * Controlled Intent -> Action -> Validation Pipeline
   * Validates proposed event mutations against strict operational bounds
   */
  public static validateProposedAction(
    eventId: string,
    intent: EventIntentType,
    payload: Record<string, any>
  ): ValidationResult {
    const event = store.getEvent(eventId);
    const violations: string[] = [];

    if (!event) {
      return {
        isValid: false,
        violations: [`Event ID ${eventId} does not exist.`],
        intent,
        confidence: 0,
        explanation: 'Event context not found.',
      };
    }

    switch (intent) {
      case 'CREATE_TASK': {
        if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length < 3) {
          violations.push('Task title must be at least 3 characters long.');
        }
        if (payload.estimatedCost && Number(payload.estimatedCost) < 0) {
          violations.push('Estimated cost cannot be negative.');
        }
        // Verify dependencies if specified
        if (payload.dependsOn && Array.isArray(payload.dependsOn)) {
          const existingTasks = store.getTasks(eventId);
          for (const depId of payload.dependsOn) {
            if (!existingTasks.some((t) => t.id === depId)) {
              violations.push(`Prerequisite task ${depId} does not exist in event.`);
            }
          }
        }
        break;
      }

      case 'UPDATE_TASK': {
        const tasks = store.getTasks(eventId);
        const task = tasks.find((t) => t.id === payload.taskId);
        if (!task) {
          violations.push(`Target task ${payload.taskId} not found.`);
        } else if (payload.status === 'done') {
          // Dependency Guard: Verify prerequisite tasks are done
          if (task.dependsOn && task.dependsOn.length > 0) {
            const incompletePrereqs = tasks.filter(
              (t) => task.dependsOn!.includes(t.id) && t.status !== 'done'
            );
            if (incompletePrereqs.length > 0) {
              violations.push(
                `Cannot complete task: Prerequisite task(s) [${incompletePrereqs
                  .map((p) => p.title)
                  .join(', ')}] are still pending.`
              );
            }
          }
        }
        break;
      }

      case 'RESCHEDULE_SUB_EVENT': {
        if (!payload.subEventId) {
          violations.push('Sub-event ID is required for rescheduling.');
        }
        if (payload.day && (payload.day < 1 || payload.day > 10)) {
          violations.push('Sub-event day must be between 1 and 10.');
        }
        break;
      }

      case 'MODIFY_CAPACITY': {
        if (payload.fleetCapacityAllocated !== undefined && Number(payload.fleetCapacityAllocated) < 0) {
          violations.push('Fleet capacity cannot be negative.');
        }
        if (payload.hotelRoomsBooked !== undefined && Number(payload.hotelRoomsBooked) < 0) {
          violations.push('Hotel room count cannot be negative.');
        }
        break;
      }

      case 'REALLOCATE_BUDGET': {
        const delta = Number(payload.amount || 0);
        const projectedSpent = (event.spent || 0) + delta;
        if (projectedSpent > (event.budget || 0) * 1.25) {
          violations.push(
            `Budget overrun limit breached: Requested allocation exceeds maximum 25% contingency cap.`
          );
        }
        break;
      }

      default:
        break;
    }

    const isValid = violations.length === 0;
    const confidence = isValid ? (intent === 'GENERAL_QUERY' ? 0.92 : 0.98) : 0.45;
    const explanation = isValid
      ? `Validated intent [${intent}] successfully against event operational rules.`
      : `Operational validation failed for [${intent}]: ${violations.join('; ')}`;

    return {
      isValid,
      violations,
      intent,
      confidence,
      explanation,
      sanitizedPayload: payload,
    };
  }

  /**
   * Executes a validated mutation atomically and records an audit log
   */
  public static executeValidatedAction(
    eventId: string,
    validation: ValidationResult,
    actor = 'Harsh Raghuwanshi (Lead Event Director)'
  ): boolean {
    if (!validation.isValid || !validation.sanitizedPayload) return false;

    const payload = validation.sanitizedPayload;
    let actionDesc = '';
    let prevVal: any = null;
    let newVal: any = null;

    switch (validation.intent) {
      case 'CREATE_TASK': {
        const newTask: ITask = {
          id: `tsk_${Date.now()}`,
          eventId,
          title: payload.title,
          category: payload.category || 'general',
          status: 'todo',
          priority: payload.priority || 'medium',
          assignee: payload.assignee || 'Event Operations Team',
          dueDate: payload.dueDate || '2025-11-14',
          estimatedCost: payload.estimatedCost || 0,
          dependsOn: payload.dependsOn || [],
        };
        store.addTask(newTask);
        actionDesc = `Created new task: "${newTask.title}" (${newTask.priority} priority)`;
        newVal = newTask;
        break;
      }

      case 'UPDATE_TASK': {
        const task = store.getTasks(eventId).find((t) => t.id === payload.taskId);
        if (task) {
          prevVal = { status: task.status };
          store.updateTask(task.id, { status: payload.status });
          newVal = { status: payload.status };
          actionDesc = `Updated task "${task.title}" status to [${payload.status}]`;
        }
        break;
      }

      case 'FLAG_VENDOR_GAP': {
        const vendors = store.getVendors(eventId);
        const target = vendors.find((v) => v.category === payload.category);
        if (target) {
          prevVal = { status: target.status };
          store.updateVendor(target.id, { status: 'gap' });
          newVal = { status: 'gap' };
          actionDesc = `Flagged vendor gap for category: ${payload.category} (${target.name})`;
        }
        break;
      }

      case 'MODIFY_CAPACITY': {
        const log = store.getLogistics(eventId);
        prevVal = { ...log };
        store.updateLogistics(eventId, {
          fleetCapacityAllocated: payload.fleetCapacityAllocated ?? log?.fleetCapacityAllocated,
          fleetCapacityRequired: payload.fleetCapacityRequired ?? log?.fleetCapacityRequired,
          hotelRoomsBooked: payload.hotelRoomsBooked ?? log?.hotelRoomsBooked,
          hotelRoomsRequired: payload.hotelRoomsRequired ?? log?.hotelRoomsRequired,
        });
        newVal = store.getLogistics(eventId);
        actionDesc = `Modified logistics capacities: Fleet ${newVal?.fleetCapacityAllocated}/${newVal?.fleetCapacityRequired} PAX`;
        break;
      }

      case 'REALLOCATE_BUDGET': {
        const evt = store.getEvent(eventId);
        if (evt) {
          prevVal = { spent: evt.spent };
          const newSpent = (evt.spent || 0) + (Number(payload.amount) || 0);
          store.updateEvent(eventId, { spent: newSpent });
          newVal = { spent: newSpent };
          actionDesc = `Reallocated budget contingency: +₹${payload.amount} (Total spent: ₹${newSpent})`;
        }
        break;
      }

      default:
        actionDesc = `Executed action: ${validation.intent}`;
        break;
    }

    // Record immutable audit log
    if (actionDesc) {
      store.addAuditLog({
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actor,
        actionType: validation.intent,
        description: actionDesc,
        previousValue: prevVal,
        newValue: newVal,
      });

      // Post notification if critical
      if (validation.intent === 'FLAG_VENDOR_GAP' || validation.intent === 'REALLOCATE_BUDGET') {
        store.addNotification({
          id: `notif_${Date.now()}`,
          eventId,
          title: validation.intent === 'FLAG_VENDOR_GAP' ? 'Critical Vendor Gap' : 'Budget Reallocation',
          message: actionDesc,
          type: validation.intent === 'FLAG_VENDOR_GAP' ? 'crisis' : 'system',
          read: false,
          timestamp: 'Just now',
        });
      }
    }

    return true;
  }
}
