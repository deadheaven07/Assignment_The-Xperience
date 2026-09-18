'use client';

import React from 'react';
import { ISubEvent } from '@/lib/types';
import { StatusPill } from '@/components/ui/StatusPill';
import { Calendar, Clock, MapPin, Users, Sparkles } from 'lucide-react';

interface TimelineViewProps {
  subEvents: ISubEvent[];
  eventType: 'wedding' | 'corporate';
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  subEvents,
  eventType,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#9E1B32]" />
            <span>Master Schedule & Sub-Events Itinerary</span>
          </h3>
          <p className="text-xs text-slate-500">
            Chronological sequencing across all {subEvents.length} core celebrations & sessions.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDFBF2] text-[#B89428] border border-[#E6C66E]">
          {eventType === 'wedding' ? '3-Day Royal Itinerary' : '2-Day Corporate Outing'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {subEvents.map((event, index) => (
          <div
            key={event.id}
            className="bg-white rounded-xl p-4 border border-[#E6C66E]/40 hover:border-[#D4AF37] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FDF2F4] text-[#9E1B32] border border-[#F7D6DC]">
                  Day {event.day} • {event.date}
                </span>
                <StatusPill status={event.status} pulse={event.status === 'upcoming'} />
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-2">
                {event.title}
              </h4>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{event.expectedGuests} Expected Attendees</span>
                </div>
              </div>
            </div>

            {event.notes && (
              <div className="pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-500 bg-[#FAF8F5] p-2 rounded-lg">
                <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{event.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
