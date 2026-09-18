'use client';

import React from 'react';
import { IEvent } from '@/lib/types';
import { Crown, Building2, RefreshCw } from 'lucide-react';

interface EventSwitcherProps {
  events: IEvent[];
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
  onResetEvent: () => void;
  isResetting?: boolean;
}

export const EventSwitcher: React.FC<EventSwitcherProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  onResetEvent,
  isResetting = false,
}) => {
  const currentEvent = events.find((e) => e.id === selectedEventId);
  const isWedding = currentEvent?.type === 'wedding';

  return (
    <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#E6C66E]/40 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isWedding
                ? 'bg-[#FDF2F4] text-[#9E1B32] border border-[#F7D6DC]'
                : 'bg-[#FEF6E9] text-[#EAA221] border border-[#F9DCB0]'
            }`}
          >
            {isWedding ? <Crown className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Active Assessment Scenario
            </span>
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={(e) => onSelectEvent(e.target.value)}
                className="font-bold text-sm text-slate-800 bg-transparent border-0 pr-6 py-0 focus:ring-0 cursor-pointer truncate"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id} className="text-slate-800">
                    {evt.type === 'wedding' ? '💍 ' : '🏢 '}
                    {evt.title} ({evt.totalGuests} {evt.type === 'wedding' ? 'Guests' : 'PAX'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={onResetEvent}
          disabled={isResetting}
          title="Reset scenario to initial seed state for re-evaluation"
          className="p-1.5 rounded-lg border border-slate-200 hover:border-[#D4AF37] hover:bg-[#FDFBF2] text-slate-500 hover:text-[#9E1B32] transition-colors shrink-0 flex items-center gap-1 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline font-medium">Reset</span>
        </button>
      </div>

      {currentEvent && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="truncate">{currentEvent.location}</span>
          <span>•</span>
          <span className="shrink-0 font-medium text-slate-700">
            {currentEvent.startDate} to {currentEvent.endDate}
          </span>
        </div>
      )}
    </div>
  );
};
