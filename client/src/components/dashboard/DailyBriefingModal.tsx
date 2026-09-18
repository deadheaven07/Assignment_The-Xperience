'use client';

import React, { useState, useEffect } from 'react';
import { IDailyBriefing } from '@/lib/types';
import { api } from '@/lib/api';
import { FileText, X, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Printer, Copy, Loader2, Calendar } from 'lucide-react';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
}) => {
  const [briefing, setBriefing] = useState<IDailyBriefing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.generateDailyBriefing(eventId)
        .then((res) => {
          if (res.success) setBriefing(res.briefing);
        })
        .catch((err) => console.error('Failed to load briefing:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, eventId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!briefing) return;
    const text = `📋 EXECUTIVE DAILY EVENT BRIEFING
Event: ${eventTitle || 'Event'}
Generated: ${new Date().toLocaleString()}
Director: Harsh Raghuwanshi (Lead Event Director)

${briefing.executiveSummary}

⚠️ KEY RISKS:
${(briefing.keyRisks || []).map((r) => `• ${r}`).join('\n')}

⚡ URGENT ACTIONS & BLOCKERS:
${(briefing.urgentActions || []).map((a) => `• ${a}`).join('\n')}

🎯 MILESTONE COUNTDOWNS:
${(briefing.milestoneCountdowns || []).map((m) => `• ${m.milestone}: ${m.daysRemaining} days remaining (${m.status})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E6C66E]/60 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E6C66E]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E6C66E] flex items-center justify-center text-[#9E1B32] shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                1-Click Executive Daily Briefing
              </h3>
              <p className="text-xs text-slate-500">
                Prepared by Harsh Raghuwanshi (Lead Event Director) • {eventTitle || 'Event'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 flex-1 overflow-y-auto max-h-[75vh]">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-[#9E1B32]" />
              <span className="text-xs font-semibold">Compiling real-time operational status...</span>
            </div>
          ) : briefing ? (
            <div className="space-y-4 text-slate-800">
              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6C66E]/60 shadow-2xs">
                <span className="text-[10px] font-bold text-[#9E1B32] uppercase tracking-wider block mb-1">
                  Executive Briefing & Health Assessment
                </span>
                <p className="text-xs leading-relaxed font-medium text-slate-700">
                  {briefing.executiveSummary}
                </p>
              </div>

              {/* Milestone Countdowns */}
              {briefing.milestoneCountdowns && briefing.milestoneCountdowns.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Critical Milestone Timeline (T-N Days)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {briefing.milestoneCountdowns.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center shadow-2xs ${
                          m.status === 'critical'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : m.status === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide block truncate mb-1">
                          {m.milestone}
                        </span>
                        <span className="text-xl font-extrabold block">
                          T - {m.daysRemaining}d
                        </span>
                        <span className="text-[10px] capitalize font-medium block mt-0.5">
                          Status: {m.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Risks */}
              {briefing.keyRisks && briefing.keyRisks.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Key Identified Risks
                  </span>
                  <div className="space-y-1.5">
                    {briefing.keyRisks.map((risk, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium leading-snug"
                      >
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Urgent Actions & Blockers */}
              {briefing.urgentActions && briefing.urgentActions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5 text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    Urgent Actions & Dependency Blockers
                  </span>
                  <div className="space-y-1.5">
                    {briefing.urgentActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-slate-800 leading-snug flex items-start gap-2"
                      >
                        <span className="text-amber-600 font-bold shrink-0">⚡</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF8F5] border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Briefing</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#9E1B32] text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
