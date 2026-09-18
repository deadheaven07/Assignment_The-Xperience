'use client';

import React from 'react';
import { IRiskAlert } from '@/lib/types';
import { AlertTriangle, ShieldAlert, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

interface RiskRadarProps {
  risks: IRiskAlert[];
  onExecuteAction: (actionType: string, payload: Record<string, any>) => void;
  isLoading?: boolean;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({
  risks,
  onExecuteAction,
  isLoading = false,
}) => {
  if (!risks || risks.length === 0) {
    return (
      <div className="mx-4 mt-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Autonomous Risk Radar: All Clear
            </h4>
            <p className="text-xs text-emerald-700">
              Zero active capacity deficits, vendor gaps, or immediate timeline collisions detected.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-800 px-2.5 py-1 bg-white rounded-full border border-emerald-200">
          Optimal State
        </span>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E1B32]">
          <ShieldAlert className="w-4 h-4 text-[#9E1B32] animate-bounce" />
          <span>Autonomous Proactive Risk Radar ({risks.length} Pending)</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Instant 1-Click AI Remediation Available
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">

      {risks.map((risk) => {
        const isCritical = risk.severity === 'critical';
        const isCapacity = risk.type === 'capacity_deficit';
        const isVendorGap = risk.type === 'vendor_gap';

        const containerClasses = isCritical
          ? 'bg-rose-50/90 border-rose-300 shadow-[0_4px_12px_rgba(220,38,38,0.08)]'
          : 'bg-amber-50/90 border-amber-300 shadow-[0_4px_12px_rgba(217,119,6,0.08)]';

        const titleClasses = isCritical ? 'text-rose-950' : 'text-amber-950';
        const badgeClasses = isCritical
          ? 'bg-rose-100 text-rose-800 border-rose-200'
          : 'bg-amber-100 text-amber-800 border-amber-200';

        return (
          <div
            key={risk.id}
            className={`rounded-xl p-3.5 border transition-all ${containerClasses}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/90 shrink-0 mt-0.5 shadow-2xs">
                  {isCritical ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm font-bold ${titleClasses}`}>
                      {risk.title}
                    </h4>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeClasses}`}>
                      {risk.severity}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      {risk.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {risk.message}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium italic">
                    Impact: {risk.impact}
                  </p>
                </div>
              </div>
            </div>

            {/* 1-Click AI Actions Bar */}
            {risk.recommendedActions && risk.recommendedActions.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  1-Click AI Actions:
                </span>
                {risk.recommendedActions.map((action) => (
                  <button
                    key={action.id}
                    disabled={isLoading}
                    onClick={() => onExecuteAction(action.actionType, action.payload)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#9E1B32] shadow-2xs hover:shadow-xs active:scale-95 transition-all disabled:opacity-50"
                  >
                    <span className="text-emerald-600 font-bold">⚡</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};
