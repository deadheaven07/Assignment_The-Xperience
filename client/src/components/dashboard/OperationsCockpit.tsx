'use client';

import React, { useState } from 'react';
import { IEventSnapshot, TaskStatus } from '@/lib/types';
import { MetricsHeader } from './MetricsHeader';
import { RiskRadar } from './RiskRadar';
import { TimelineView } from './TimelineView';
import { KanbanBoard } from './KanbanBoard';
import { VendorGrid } from './VendorGrid';
import { LogisticsMatrix } from './LogisticsMatrix';
import { BudgetAnalytics } from './BudgetAnalytics';
import { Calendar, CheckSquare, Store, Truck, BarChart3, ShieldAlert } from 'lucide-react';

interface OperationsCockpitProps {
  snapshot: IEventSnapshot;
  onExecuteAction: (actionType: string, payload: Record<string, any>) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: any) => void;
  isLoading?: boolean;
  currentTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export type TabType = 'timeline' | 'kanban' | 'vendors' | 'logistics' | 'budget';

export const OperationsCockpit: React.FC<OperationsCockpitProps> = ({
  snapshot,
  onExecuteAction,
  onUpdateTaskStatus,
  onAddTask,
  isLoading = false,
  currentTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<TabType>('timeline');
  const activeTab = currentTab !== undefined ? currentTab : internalTab;
  const setActiveTab = (t: TabType) => {
    setInternalTab(t);
    if (onTabChange) onTabChange(t);
  };
  const { event, subEvents, tasks, vendors, logistics, risks } = snapshot;

  if (!event) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-slate-500">
        No event data available.
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'timeline',
      label: 'Timeline & Schedule',
      icon: <Calendar className="w-3.5 h-3.5" />,
      badge: subEvents.length,
    },
    {
      id: 'kanban',
      label: 'Smart Kanban',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      badge: tasks.length,
    },
    {
      id: 'vendors',
      label: 'Procurement Hub',
      icon: <Store className="w-3.5 h-3.5" />,
      badge: vendors.length,
    },
    {
      id: 'logistics',
      label: 'Logistics Matrix',
      icon: <Truck className="w-3.5 h-3.5" />,
      badge: logistics.fleetCapacityAllocated < logistics.fleetCapacityRequired ? 1 : undefined,
    },
    {
      id: 'budget',
      label: 'Spend Analytics',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFFDF9] overflow-hidden">
      {/* 1. Executive KPI Bar */}
      <MetricsHeader
        event={event}
        onSelectRisksTab={() => {
          // Keep on top of page
        }}
      />

      {/* 2. Autonomous Proactive Risk Radar */}
      <RiskRadar
        risks={risks}
        onExecuteAction={onExecuteAction}
        isLoading={isLoading}
      />

      {/* 3. Operational Module Tabs */}
      <div className="px-4 mt-3 border-b border-[#E6C66E]/40 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-white/80 backdrop-blur-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
                isActive
                  ? 'border-[#9E1B32] text-[#9E1B32]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? 'bg-[#9E1B32] text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Active Module Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'timeline' && (
          <TimelineView subEvents={subEvents} eventType={event.type} />
        )}
        {activeTab === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onAddTask={onAddTask}
          />
        )}
        {activeTab === 'vendors' && (
          <VendorGrid vendors={vendors} />
        )}
        {activeTab === 'logistics' && (
          <LogisticsMatrix logistics={logistics} totalGuests={event.totalGuests} />
        )}
        {activeTab === 'budget' && (
          <BudgetAnalytics event={event} vendors={vendors} />
        )}
      </div>
    </div>
  );
};
