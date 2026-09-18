'use client';

import React, { useState, useEffect } from 'react';
import { IWhatIfSimulation } from '@/lib/types';
import { api } from '@/lib/api';
import { Sliders, X, AlertTriangle, CheckCircle2, CloudRain, Users, DollarSign, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface WhatIfModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
  currentGuests: number;
  currentBudget: number;
  currentSpent: number;
  onApplyMitigation?: (recommendation: string) => void;
}

export const WhatIfModal: React.FC<WhatIfModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  currentGuests,
  currentBudget,
  currentSpent,
  onApplyMitigation,
}) => {
  const [guestDelta, setGuestDelta] = useState<number>(0);
  const [indoorShift, setIndoorShift] = useState<boolean>(false);
  const [simulation, setSimulation] = useState<IWhatIfSimulation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runSimulation = async (delta: number, indoor: boolean) => {
    setIsLoading(true);
    try {
      const res = await api.simulateWhatIf(eventId, delta, indoor);
      if (res.success) {
        setSimulation(res.simulation);
      }
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runSimulation(guestDelta, indoorShift);
    }
  }, [isOpen, guestDelta, indoorShift, eventId]);

  if (!isOpen) return null;

  const projectedGuests = Math.max(10, currentGuests + guestDelta);
  const projectedBudget = currentSpent + (simulation?.projectedBudgetVariance || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E6C66E]/60 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#E6C66E]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E6C66E] flex items-center justify-center text-[#9E1B32] shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Cognitive &ldquo;What-If&rdquo; Scenario Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate stress conditions, crowd surges, and weather contingencies for {eventTitle || 'Current Event'}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1 overflow-y-auto max-h-[75vh]">
          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Instant Scenario Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => { setGuestDelta(50); setIndoorShift(false); }}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                  guestDelta === 50 && !indoorShift
                    ? 'bg-[#9E1B32] text-white border-[#9E1B32]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#D4AF37]'
                }`}
              >
                +50 VIP Guests
              </button>
              <button
                onClick={() => { setGuestDelta(-30); setIndoorShift(false); }}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                  guestDelta === -30 && !indoorShift
                    ? 'bg-[#9E1B32] text-white border-[#9E1B32]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#D4AF37]'
                }`}
              >
                -30 Guests (Dip)
              </button>
              <button
                onClick={() => { setGuestDelta(0); setIndoorShift(true); }}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                  guestDelta === 0 && indoorShift
                    ? 'bg-[#9E1B32] text-white border-[#9E1B32]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#D4AF37]'
                }`}
              >
                🌧️ Rain Shift Indoors
              </button>
              <button
                onClick={() => { setGuestDelta(60); setIndoorShift(true); }}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                  guestDelta === 60 && indoorShift
                    ? 'bg-[#9E1B32] text-white border-[#9E1B32]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#D4AF37]'
                }`}
              >
                ⚠️ Overload (+60 & Rain)
              </button>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            {/* Guest Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Headcount Adjustment Delta:
                </span>
                <span className="font-bold text-sm text-[#9E1B32]">
                  {guestDelta >= 0 ? `+${guestDelta}` : guestDelta} Guests ({projectedGuests} Projected)
                </span>
              </div>
              <input
                type="range"
                min="-60"
                max="120"
                step="5"
                value={guestDelta}
                onChange={(e) => setGuestDelta(Number(e.target.value))}
                className="w-full accent-[#9E1B32] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>-60 PAX</span>
                <span>Baseline (0)</span>
                <span>+120 PAX</span>
              </div>
            </div>

            {/* Weather Toggle */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">
                    Rain Contingency Protocol
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Move all lawn ceremonies into indoor ballrooms with acoustic staging.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIndoorShift(!indoorShift)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  indoorShift
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {indoorShift ? 'Active (Indoor)' : 'Inactive'}
              </button>
            </div>
          </div>

          {/* Simulation Output Dashboard */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-[#9E1B32]" />
              <span className="text-xs font-semibold">Recalculating event physics...</span>
            </div>
          ) : simulation ? (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Feasibility */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    Feasibility
                  </span>
                  <span
                    className={`text-xl font-extrabold ${
                      (simulation.feasibilityScore || 80) >= 80
                        ? 'text-emerald-600'
                        : (simulation.feasibilityScore || 80) >= 60
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {simulation.feasibilityScore || 85}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {(simulation.feasibilityScore || 80) >= 80 ? 'High Confidence' : 'Risk Elevated'}
                  </span>
                </div>

                {/* Budget Variance */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    Cost Variance
                  </span>
                  <span
                    className={`text-xl font-extrabold ${
                      (simulation.projectedBudgetVariance || 0) > 0
                        ? 'text-rose-600'
                        : (simulation.projectedBudgetVariance || 0) < 0
                        ? 'text-emerald-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {(simulation.projectedBudgetVariance || 0) >= 0 ? '+' : ''}
                    ₹{((simulation.projectedBudgetVariance || 0) / 1000).toFixed(0)}k
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                    Total: ₹{(projectedBudget / 100000).toFixed(2)}L
                  </span>
                </div>

                {/* Projected Readiness */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    Readiness Score
                  </span>
                  <span className="text-xl font-extrabold text-[#9E1B32]">
                    {simulation.projectedReadinessScore || 80}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Live Projected
                  </span>
                </div>
              </div>

              {/* Warnings List */}
              {simulation.warnings && simulation.warnings.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Stress Warnings Detected:</span>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-[11px] text-rose-700">
                    {simulation.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Mitigations */}
              {simulation.recommendedAdjustments && simulation.recommendedAdjustments.length > 0 && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI Mitigation Adjustments:</span>
                  </div>
                  <div className="space-y-1.5">
                    {simulation.recommendedAdjustments.map((rec, i) => (
                      <div
                        key={i}
                        className="p-2 bg-white rounded-lg border border-emerald-200 text-xs text-slate-700 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <span className="leading-snug">{rec}</span>
                        {onApplyMitigation && (
                          <button
                            onClick={() => onApplyMitigation(rec)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 shrink-0 flex items-center gap-1"
                          >
                            <span>Adopt</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => { setGuestDelta(0); setIndoorShift(false); }}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
          >
            Reset to Baseline
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#9E1B32] text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
