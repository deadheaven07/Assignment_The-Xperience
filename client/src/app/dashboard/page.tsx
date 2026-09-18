'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { IEvent, IEventSnapshot, TaskStatus, EventLifecycleStage, IAuditLogEntry, INotification } from '@/lib/types';
import { Navbar } from '@/components/layout/Navbar';
import { CommandDrawer } from '@/components/layout/CommandDrawer';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { OperationsCockpit, TabType } from '@/components/dashboard/OperationsCockpit';
import { AuditLogDrawer } from '@/components/dashboard/AuditLogDrawer';
import { WhatIfModal } from '@/components/dashboard/WhatIfModal';
import { DailyBriefingModal } from '@/components/dashboard/DailyBriefingModal';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('evt_wedding_001');
  const [snapshot, setSnapshot] = useState<IEventSnapshot | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isWhatIfModalOpen, setIsWhatIfModalOpen] = useState(false);
  const [isDailyBriefingModalOpen, setIsDailyBriefingModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<IAuditLogEntry[]>([]);
  const [activeCockpitTab, setActiveCockpitTab] = useState<TabType>('timeline');

  // Fetch full snapshot for an event
  const loadEventSnapshot = useCallback(async (eventId: string) => {
    try {
      const data = await api.getEventSnapshot(eventId);
      if (data.success) {
        setSnapshot({
          event: data.event,
          subEvents: data.subEvents,
          tasks: data.tasks,
          vendors: data.vendors,
          logistics: data.logistics,
          risks: data.risks,
          chatMessages: data.chatMessages,
          auditLogs: data.auditLogs || [],
          notifications: data.notifications || [],
        });
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err: any) {
      console.error('Error loading snapshot:', err);
    }
  }, []);

  // Initial Boot
  useEffect(() => {
    async function boot() {
      try {
        const eventsRes = await api.getEvents();
        if (eventsRes.success && eventsRes.events.length > 0) {
          setEvents(eventsRes.events);
          const initialId = eventsRes.events[0].id;
          setSelectedEventId(initialId);
          await loadEventSnapshot(initialId);
        }
      } catch (err: any) {
        console.error('Failed to boot dashboard:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    boot();
  }, [loadEventSnapshot]);

  // Handle Event Switcher selection
  const handleSelectEvent = async (eventId: string) => {
    setSelectedEventId(eventId);
    setIsProcessing(true);
    await loadEventSnapshot(eventId);
    setIsProcessing(false);
  };

  // Reset Event scenario to initial seed state
  const handleResetEvent = async () => {
    setIsResetting(true);
    try {
      const data = await api.resetEvent(selectedEventId);
      if (data.success) {
        setSnapshot({
          event: data.event,
          subEvents: data.subEvents,
          tasks: data.tasks,
          vendors: data.vendors,
          logistics: data.logistics,
          risks: data.risks,
          chatMessages: data.chatMessages,
        });
        // Refresh events list metrics
        const eventsRes = await api.getEvents();
        if (eventsRes.success) setEvents(eventsRes.events);
      }
    } catch (err: any) {
      console.error('Error resetting event:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Handle User Message or Preset Pill Click
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isProcessing) return;

    // Optimistically append user message to local state
    const optimisticUserMsg = {
      id: `msg_opt_${Date.now()}`,
      eventId: selectedEventId,
      sender: 'user' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (snapshot) {
      setSnapshot({
        ...snapshot,
        chatMessages: [...snapshot.chatMessages, optimisticUserMsg],
      });
    }

    setIsProcessing(true);
    try {
      const data = await api.sendMessage(selectedEventId, messageText);
      if (data.success) {
        setSnapshot({
          event: data.event,
          subEvents: data.subEvents,
          tasks: data.tasks,
          vendors: data.vendors,
          logistics: data.logistics,
          risks: data.risks,
          chatMessages: data.chatMessages,
        });

        // Update events list
        setEvents((prev) =>
          prev.map((e) => (e.id === data.event.id ? data.event : e))
        );
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle 1-Click AI Actions from Risk Radar or Chat Chips
  const handleExecuteAction = async (actionType: string, payload?: Record<string, any>) => {
    setIsProcessing(true);
    try {
      const safePayload = {
        eventId: selectedEventId,
        ...(payload || {}),
      };

      if (actionType === 'NAVIGATE_TAB') {
        if (payload?.tab) setActiveCockpitTab(payload.tab as TabType);
        return;
      }

      if (actionType === 'TRIGGER_CALL') {
        if (payload?.phone) window.open(`tel:${payload.phone}`);
        return;
      }

      const data = await api.executeRiskAction(actionType, safePayload);
      if (data.success) {
        setSnapshot({
          event: data.event,
          subEvents: data.subEvents,
          tasks: data.tasks,
          vendors: data.vendors,
          logistics: data.logistics,
          risks: data.risks,
          chatMessages: data.chatMessages,
        });

        setEvents((prev) =>
          prev.map((e) => (e.id === data.event.id ? data.event : e))
        );
      }
    } catch (err: any) {
      console.error('Error executing risk action:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Update Event core and logistics details from Command Drawer
  const handleUpdateEventDetails = async (updates: {
    title?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    totalGuests?: number;
    budget?: number;
    fleetCapacityRequired?: number;
    fleetCapacityAllocated?: number;
    hotelRoomsRequired?: number;
    hotelRoomsBooked?: number;
  }) => {
    try {
      const eventUpdates: Partial<IEvent> = {};
      if (updates.title !== undefined) eventUpdates.title = updates.title;
      if (updates.location !== undefined) eventUpdates.location = updates.location;
      if (updates.startDate !== undefined) eventUpdates.startDate = updates.startDate;
      if (updates.endDate !== undefined) eventUpdates.endDate = updates.endDate;
      if (updates.totalGuests !== undefined) eventUpdates.totalGuests = updates.totalGuests;
      if (updates.budget !== undefined) eventUpdates.budget = updates.budget;

      await api.updateEvent(selectedEventId, eventUpdates);

      if (
        updates.fleetCapacityRequired !== undefined ||
        updates.fleetCapacityAllocated !== undefined ||
        updates.hotelRoomsRequired !== undefined ||
        updates.hotelRoomsBooked !== undefined
      ) {
        await api.updateLogistics(selectedEventId, {
          fleetCapacityRequired: updates.fleetCapacityRequired,
          fleetCapacityAllocated: updates.fleetCapacityAllocated,
          hotelRoomsRequired: updates.hotelRoomsRequired,
          hotelRoomsBooked: updates.hotelRoomsBooked,
        });
      }

      await loadEventSnapshot(selectedEventId);
      const eventsRes = await api.getEvents();
      if (eventsRes.success) setEvents(eventsRes.events);
    } catch (err: any) {
      console.error('Failed to update event details:', err);
      throw err;
    }
  };

  // Add Partner Vendor from Command Drawer
  const handleAddVendor = async (vendorData: any) => {
    try {
      const res = await api.addVendor(selectedEventId, vendorData);
      if (res.success) {
        await loadEventSnapshot(selectedEventId);
      }
    } catch (err: any) {
      console.error('Failed to add vendor:', err);
    }
  };

  // Update Kanban Task
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const res = await api.updateTask(taskId, { status: newStatus });
      if (res.success && snapshot) {
        setSnapshot({
          ...snapshot,
          tasks: snapshot.tasks.map((t) => (t.id === taskId ? res.task : t)),
        });
      }
    } catch (err: any) {
      console.error('Error updating task:', err);
    }
  };

  // Add Task to Kanban
  const handleAddTask = async (taskData: any) => {
    try {
      const res = await api.addTask({ ...taskData, eventId: selectedEventId });
      if (res.success && snapshot) {
        setSnapshot({
          ...snapshot,
          tasks: [...snapshot.tasks, res.task],
        });
      }
    } catch (err: any) {
      console.error('Error adding task:', err);
    }
  };

  // Lifecycle Stage Update
  const handleUpdateLifecycleStage = async (stage: EventLifecycleStage) => {
    try {
      const res = await api.updateEvent(selectedEventId, { lifecycleStage: stage });
      if (res.success && snapshot) {
        setSnapshot({
          ...snapshot,
          event: { ...snapshot.event, lifecycleStage: stage },
        });
        setEvents((prev) =>
          prev.map((e) => (e.id === selectedEventId ? { ...e, lifecycleStage: stage } : e))
        );
      }
    } catch (err) {
      console.error('Error updating lifecycle stage:', err);
    }
  };

  // Notification Handlers
  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      if (snapshot) {
        setSnapshot({
          ...snapshot,
          notifications: (snapshot.notifications || []).map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead(selectedEventId);
      if (snapshot) {
        setSnapshot({
          ...snapshot,
          notifications: (snapshot.notifications || []).map((n) => ({ ...n, read: true })),
        });
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const handleApplySimulationMitigation = (recommendation: string) => {
    setIsWhatIfModalOpen(false);
    handleSendMessage(`Adopt simulation mitigation strategy: ${recommendation}`);
  };

  if (isInitializing || !snapshot) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#9E1B32]" />
        <p className="text-sm font-semibold text-slate-700">
          Initializing PlanCraft AI Event Management Cockpit...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAF8F5]">
      {/* 1. Global Navigation Bar with Drawer Trigger */}
      <Navbar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenWhatIf={() => setIsWhatIfModalOpen(true)}
        onOpenBriefing={() => setIsDailyBriefingModalOpen(true)}
        onOpenAuditLogs={() => setIsAuditDrawerOpen(true)}
        notifications={snapshot.notifications || []}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        lifecycleStage={snapshot.event?.lifecycleStage || 'planning'}
        onUpdateLifecycleStage={handleUpdateLifecycleStage}
      />

      {/* 2. Side Command Drawer & Event Settings Hub */}
      <CommandDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={handleSelectEvent}
        snapshot={snapshot}
        onNavigateTab={(tabKey) => setActiveCockpitTab(tabKey as TabType)}
        onSendMessage={handleSendMessage}
        onResetEvent={handleResetEvent}
        onUpdateEventDetails={handleUpdateEventDetails}
        onAddTask={handleAddTask}
        onAddVendor={handleAddVendor}
        isResetting={isResetting}
      />

      {/* 3. Operational Audit Trail Drawer */}
      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditLogs={snapshot.auditLogs || auditLogs}
        eventTitle={snapshot.event?.title}
      />

      {/* 4. Cognitive What-If Scenario Modal */}
      <WhatIfModal
        isOpen={isWhatIfModalOpen}
        onClose={() => setIsWhatIfModalOpen(false)}
        eventId={selectedEventId}
        eventTitle={snapshot.event?.title}
        currentGuests={snapshot.event?.totalGuests || 400}
        currentBudget={snapshot.event?.budget || 4500000}
        currentSpent={snapshot.event?.spent || 3150000}
        onApplyMitigation={handleApplySimulationMitigation}
      />

      {/* 5. Executive Daily Briefing Modal */}
      <DailyBriefingModal
        isOpen={isDailyBriefingModalOpen}
        onClose={() => setIsDailyBriefingModalOpen(false)}
        eventId={selectedEventId}
        eventTitle={snapshot.event?.title}
      />

      {/* 6. DUAL-PANE REACTIVE ARCHITECTURE */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane (38% Width): Conversational AI Co-Pilot */}
        <section className="w-full lg:w-[38%] h-1/2 lg:h-full shrink-0 border-r border-[#E6C66E]/40 z-10 flex flex-col">
          <ChatWindow
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
            onResetEvent={handleResetEvent}
            messages={snapshot.chatMessages}
            onSendMessage={handleSendMessage}
            onExecuteAction={handleExecuteAction}
            isLoading={isProcessing}
            isResetting={isResetting}
          />
        </section>

        {/* Right Pane (62% Width): Interactive Event Operations Cockpit */}
        <section className="w-full lg:w-[62%] h-1/2 lg:h-full flex-1 flex flex-col overflow-hidden bg-[#FFFDF9]">
          <OperationsCockpit
            snapshot={snapshot}
            onExecuteAction={handleExecuteAction}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onAddTask={handleAddTask}
            isLoading={isProcessing}
            currentTab={activeCockpitTab}
            onTabChange={setActiveCockpitTab}
          />
        </section>
      </main>
    </div>
  );
}
