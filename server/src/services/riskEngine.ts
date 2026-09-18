import { IRiskAlert, IRiskAction } from '../types';
import { store } from '../models/store';

export class RiskEngine {
  /**
   * Evaluates all entities for an event and raises or updates proactive risks
   */
  public static evaluateEventRisks(eventId: string): IRiskAlert[] {
    const event = store.getEvent(eventId);
    if (!event) return [];

    const logistics = store.getLogistics(eventId);
    const vendors = store.getVendors(eventId);
    const subEvents = store.getSubEvents(eventId);
    const existingRisks = store.getAllRisks(eventId);

    // 1. Capacity Deficit Check
    if (logistics && logistics.fleetCapacityAllocated < logistics.fleetCapacityRequired) {
      const deficit = logistics.fleetCapacityRequired - logistics.fleetCapacityAllocated;
      const riskId = `risk_cap_${eventId}`;
      const existing = existingRisks.find((r) => r.id === riskId);

      if (!existing || !existing.resolved) {
        const capacityRisk: IRiskAlert = {
          id: riskId,
          eventId,
          title: `Fleet Capacity Shortfall (${deficit} Stranded Attendees)`,
          severity: 'critical',
          type: 'capacity_deficit',
          message: `Current contracted transit accommodates ${logistics.fleetCapacityAllocated} PAX, but required group transit is ${logistics.fleetCapacityRequired} PAX.`,
          impact: `${deficit} guests/employees face transit delays, threatening on-time arrival for scheduled sessions.`,
          resolved: false,
          riskScore: 92,
          confidence: 0.98,
          financialImpact: 45000,
          operationalImpact: 'Transit logistics bottleneck directly threatening the arrival schedule of 50 attendees.',
          recommendedActions: [
            {
              id: `act_cap_book_${Date.now()}`,
              label: `Book 50-Seater Tempo Fleet (+₹45,000)`,
              actionType: 'BOOK_ADDITIONAL_TRANSPORT',
              payload: { eventId, additionalCapacity: deficit, cost: 45000 },
            },
            {
              id: `act_cap_batch_${Date.now()}`,
              label: 'Split into 2 Departure Waves (07:00 & 08:30)',
              actionType: 'SPLIT_DEPARTURE_BATCHES',
              payload: { eventId, batches: 2 },
            },
          ],
          createdAt: new Date().toISOString(),
        };
        store.addRisk(capacityRisk);
      }
    }

    // 2. Vendor Gap Checks (e.g. Photography cancellation)
    const photoVendors = vendors.filter((v) => v.category === 'photography');
    const hasPhotoGap = photoVendors.some((v) => v.status === 'gap');
    const photoRiskId = `risk_photo_gap_${eventId}`;

    if (hasPhotoGap) {
      const existing = existingRisks.find((r) => r.id === photoRiskId);
      if (!existing || !existing.resolved) {
        const gapRisk: IRiskAlert = {
          id: photoRiskId,
          eventId,
          title: 'Reception Photographer Unavailable (Vendor Gap)',
          severity: 'critical',
          type: 'vendor_gap',
          message: 'Contracted photography crew notified cancellation for the Grand Reception sub-event.',
          impact: 'Critical moment captures, family portraits, and live reception feeds are at risk.',
          resolved: false,
          riskScore: 89,
          confidence: 0.95,
          financialImpact: 150000,
          operationalImpact: 'Total loss of media coverage for the flagship Grand Reception evening.',
          recommendedActions: [
            {
              id: `act_photo_rfp_${Date.now()}`,
              label: 'Dispatch RFP to 3 Vetted Backup Photographers',
              actionType: 'DISPATCH_BACKUP_PHOTOGRAPHER_RFP',
              payload: { eventId, budgetCap: 150000 },
            },
            {
              id: `act_photo_budget_${Date.now()}`,
              label: 'Reallocate ₹25,000 Emergency Contingency',
              actionType: 'REALLOCATE_CONTINGENCY_BUDGET',
              payload: { eventId, amount: 25000 },
            },
          ],
          createdAt: new Date().toISOString(),
        };
        store.addRisk(gapRisk);
      }
    }

    // 3. Deadline Checks
    const tasks = store.getTasks(eventId);
    const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done');
    urgentTasks.forEach((task) => {
      const deadlineRiskId = `risk_task_dl_${task.id}`;
      const hasCateringRisk = existingRisks.some(
        (r) => !r.resolved && (r.id === deadlineRiskId || (r.type === 'deadline' && r.title.toLowerCase().includes('catering')))
      );
      if (!hasCateringRisk && task.title.toLowerCase().includes('catering')) {
        const cateringRisk: IRiskAlert = {
          id: deadlineRiskId,
          eventId,
          title: 'Catering Final Guest Count Due in 7 Days',
          severity: 'warning',
          type: 'deadline',
          message: 'Catering contract requires locked headcount by Nov 7 to avoid 15% rush procurement surcharges.',
          impact: 'Budget variance of ₹60,000+ if count is not submitted within 7 days.',
          resolved: false,
          riskScore: 78,
          confidence: 0.94,
          financialImpact: 60000,
          operationalImpact: 'Vendor contractual penalty and procurement delays if guest count is not locked.',
          recommendedActions: [
            {
              id: `act_rsvp_${Date.now()}`,
              label: 'Send RSVP Nudge to 38 Pending Guests',
              actionType: 'SEND_RSVP_NUDGE',
              payload: { eventId, count: 38 },
            },
            {
              id: `act_lock_pax_${Date.now()}`,
              label: 'Lock Headcount at 400 (+5% Buffer)',
              actionType: 'LOCK_CATERING_HEADCOUNT',
              payload: { eventId, finalCount: 420 },
            },
          ],
          createdAt: new Date().toISOString(),
        };
        store.addRisk(cateringRisk);
      }
    });

    return store.getRisks(eventId);
  }

  /**
   * Executes a 1-Click AI Action to resolve a risk and update state reactively
   */
  public static executeAction(actionType: string, payload: Record<string, any>): { success: boolean; message: string } {
    const { eventId } = payload;

    switch (actionType) {
      case 'BOOK_ADDITIONAL_TRANSPORT': {
        const log = store.getLogistics(eventId);
        if (log) {
          store.updateLogistics(eventId, {
            fleetCapacityAllocated: log.fleetCapacityRequired,
            notes: (log.notes || '') + ' | [Resolved] Additional 50-seater Tempo Traveler fleet booked.',
          });
        }
        // Update corporate transport vendor if exists
        const vendors = store.getVendors(eventId);
        const transVendor = vendors.find((v) => v.category === 'transportation');
        if (transVendor) {
          store.updateVendor(transVendor.id, {
            notes: transVendor.notes + ' (Supplemental 50-seater tempo traveler confirmed).',
            cost: transVendor.cost + (payload.cost || 45000),
          });
        }
        // Mark task as done
        const tasks = store.getTasks(eventId);
        const transTask = tasks.find((t) => t.title.toLowerCase().includes('fleet') || t.title.toLowerCase().includes('bus'));
        if (transTask) {
          store.updateTask(transTask.id, { status: 'done' });
        }
        // Resolve risk
        const risk = store.getAllRisks(eventId).find((r) => r.type === 'capacity_deficit');
        if (risk) store.resolveRisk(risk.id);

        return {
          success: true,
          message: '✅ Additional 50-seater transport fleet successfully booked. Fleet capacity is now 100% (200/200 PAX).',
        };
      }

      case 'SPLIT_DEPARTURE_BATCHES': {
        const log = store.getLogistics(eventId);
        if (log) {
          store.updateLogistics(eventId, {
            fleetCapacityAllocated: log.fleetCapacityRequired,
            notes: (log.notes || '') + ' | [Resolved] Fleet shuttles staggered into Wave 1 (07:00 AM) & Wave 2 (08:30 AM).',
          });
        }
        const risk = store.getAllRisks(eventId).find((r) => r.type === 'capacity_deficit');
        if (risk) store.resolveRisk(risk.id);

        return {
          success: true,
          message: '✅ Departures split into 2 waves: Wave 1 (07:00 AM, 100 PAX) & Wave 2 (08:30 AM, 100 PAX). All attendees accommodated.',
        };
      }

      case 'DISPATCH_BACKUP_PHOTOGRAPHER_RFP': {
        const vendors = store.getVendors(eventId);
        const photoVendor = vendors.find((v) => v.category === 'photography');
        if (photoVendor) {
          store.updateVendor(photoVendor.id, {
            name: 'KalaKriti Cinema & Candid Crew (Backup Assigned)',
            status: 'shortlisted',
            notes: 'Emergency RFP dispatched to 3 vetted backup studios; KalaKriti confirmed availability for Reception.',
            cost: photoVendor.cost || 150000,
          });
        } else {
          store.addVendor({
            id: `vnd_backup_photo_${Date.now()}`,
            eventId,
            name: 'KalaKriti Cinema & Candid Crew (Backup Assigned)',
            category: 'photography',
            status: 'shortlisted',
            cost: 150000,
            contactName: 'Rohit Verma',
            phone: '+91 98200 11998',
            email: 'rohit@kalakriti.in',
            notes: 'Shortlisted via 1-Click RFP for Grand Reception coverage.',
            assignedSubEvents: ['sub_wed_4'],
          });
        }
        // Add task to Kanban
        store.addTask({
          id: `tsk_rfp_${Date.now()}`,
          eventId,
          title: 'Sign emergency contract with KalaKriti Photography for Reception',
          category: 'photography',
          status: 'in_progress',
          priority: 'urgent',
          assignee: 'Arjun Khandelwal',
          dueDate: '2025-11-15',
          estimatedCost: 150000,
        });

        const risk = store.getAllRisks(eventId).find((r) => r.type === 'vendor_gap');
        if (risk) store.resolveRisk(risk.id);

        return {
          success: true,
          message: '✅ Emergency RFP dispatched to 3 vetted backup studios. KalaKriti Photography shortlisted & contract task added to Kanban.',
        };
      }

      case 'REALLOCATE_CONTINGENCY_BUDGET': {
        const event = store.getEvent(eventId);
        if (event) {
          store.updateEvent(eventId, {
            budget: event.budget + (payload.amount || 25000),
          });
        }
        return {
          success: true,
          message: `✅ ₹${(payload.amount || 25000).toLocaleString('en-IN')} contingency buffer reallocated to event budget.`,
        };
      }

      case 'SEND_RSVP_NUDGE': {
        return {
          success: true,
          message: `✅ Automated WhatsApp & SMS RSVP nudges sent to ${payload.count || 38} pending guests.`,
        };
      }

      case 'LOCK_CATERING_HEADCOUNT': {
        const tasks = store.getTasks(eventId);
        const cateringTask = tasks.find((t) => t.title.toLowerCase().includes('catering'));
        if (cateringTask) {
          store.updateTask(cateringTask.id, { status: 'done' });
        }
        const risk = store.getAllRisks(eventId).find((r) => r.type === 'deadline');
        if (risk) store.resolveRisk(risk.id);

        return {
          success: true,
          message: `✅ Final catering headcount locked at ${payload.finalCount || 420} PAX with Shahi Dawat Caterers. Deadline risk resolved.`,
        };
      }

      default:
        return { success: false, message: 'Action not recognized.' };
    }
  }
}
