'use client';

import React from 'react';
import { Sparkles, AlertTriangle, Calendar, Users, Truck, Camera, Clock } from 'lucide-react';

interface ScenarioPresetBarProps {
  eventType: 'wedding' | 'corporate';
  onSelectPreset: (presetText: string) => void;
  isLoading?: boolean;
}

export const ScenarioPresetBar: React.FC<ScenarioPresetBarProps> = ({
  eventType,
  onSelectPreset,
  isLoading = false,
}) => {
  const weddingPresets = [
    {
      id: 'w_brief',
      label: 'Brief: 3-Day Wedding 400 Guests',
      text: 'Brief: 3-Day Wedding 400 Guests across Sangeet, Haldi, Ceremony, and Reception.',
      icon: <Sparkles className="w-3 h-3 text-[#B89428]" />,
      variant: 'gold',
    },
    {
      id: 'w_update',
      label: 'Update: Sangeet Venue Confirmed, Décor Pending',
      text: 'Update: Sangeet venue at Royal Orchid Grand Lawn is confirmed, but décor staging is pending review.',
      icon: <Calendar className="w-3 h-3 text-emerald-600" />,
      variant: 'default',
    },
    {
      id: 'w_logistics',
      label: 'Logistics: 150 Out-of-town Guests (Hotel & Cabs)',
      text: 'Logistics: 150 Out-of-town Guests need hotel room allocation and airport cab assignments.',
      icon: <Users className="w-3 h-3 text-blue-600" />,
      variant: 'default',
    },
    {
      id: 'w_deadline',
      label: 'Deadline: Catering Final Count 7 Days Prior',
      text: 'Deadline: Shahi Dawat Caterers requires final confirmed guest count 7 days prior to avoid surcharge.',
      icon: <Clock className="w-3 h-3 text-[#EAA221]" />,
      variant: 'warning',
    },
    {
      id: 'w_crisis',
      label: 'Crisis: Reception Photographer Unavailable',
      text: 'Crisis: Reception Photographer Drishti Studios notified they are unavailable due to emergency!',
      icon: <AlertTriangle className="w-3 h-3 text-rose-600" />,
      variant: 'critical',
    },
  ];

  const corporatePresets = [
    {
      id: 'c_brief',
      label: 'Brief: 2-Day Corporate Outing 200 Employees',
      text: 'Brief: 2-Day Corporate Outing for 200 Apex employees at JW Marriott Mussoorie.',
      icon: <Sparkles className="w-3 h-3 text-[#B89428]" />,
      variant: 'gold',
    },
    {
      id: 'c_update',
      label: 'Update: Resort Confirmed, 40 Flying In',
      text: 'Update: Resort confirmed for 100 rooms, 40 executives flying in to Dehradun airport.',
      icon: <Users className="w-3 h-3 text-blue-600" />,
      variant: 'default',
    },
    {
      id: 'c_schedule',
      label: 'Schedule: CEO Arriving Day 2 -> Move Keynote',
      text: 'Schedule change: CEO is arriving on Day 2 via helicopter at 10:15 AM. Move leadership keynote to 11:00 AM.',
      icon: <Calendar className="w-3 h-3 text-purple-600" />,
      variant: 'default',
    },
    {
      id: 'c_crisis',
      label: 'Crisis: Transport Vendor Only Fits 150 People',
      text: 'Crisis: Transport Vendor Metro Express only fits 150 people, but 200 attendees are departing HQ!',
      icon: <Truck className="w-3 h-3 text-rose-600" />,
      variant: 'critical',
    },
  ];

  const presets = eventType === 'wedding' ? weddingPresets : corporatePresets;

  return (
    <div className="bg-[#FAF8F5]/90 border-b border-[#E6C66E]/30 px-3.5 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          Evaluator 1-Click Scenario Presets
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          Click any pill to test AI copilot
        </span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {presets.map((p) => {
          const isCrit = p.variant === 'critical';
          const isWarn = p.variant === 'warning';
          const isGold = p.variant === 'gold';

          const btnStyle = isCrit
            ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
            : isWarn
            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
            : isGold
            ? 'bg-[#FDFBF2] hover:bg-[#FAF5E6] text-[#9E1B32] border-[#E6C66E]'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';

          return (
            <button
              key={p.id}
              disabled={isLoading}
              onClick={() => onSelectPreset(p.text)}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shadow-2xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${btnStyle}`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
