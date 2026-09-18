'use client';

import React, { useState } from 'react';
import { IAuditLogEntry } from '@/lib/types';
import { ShieldCheck, X, Clock, FileText, CheckCircle2, AlertTriangle, ChevronDown, ChevronRight, User, Terminal } from 'lucide-react';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: IAuditLogEntry[];
  eventTitle?: string;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  auditLogs,
  eventTitle,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = filter === 'all'
    ? auditLogs
    : auditLogs.filter((l) => l.actionType.toLowerCase().includes(filter.toLowerCase()) || (l.validationStatus && l.validationStatus.toLowerCase().includes(filter.toLowerCase())));

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#E6C66E]/50 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#E6C66E]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E6C66E] flex items-center justify-center text-[#9E1B32]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Operational Audit Trail & Rule Log
              </h3>
              <p className="text-[11px] text-slate-500">
                {eventTitle ? `Immutable log for ${eventTitle}` : 'Immutable operational compliance record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-white/70 border-b border-slate-200/80 flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-600">Filter:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'task', 'risk', 'event', 'approved', 'flagged'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize transition-all ${
                  filter === f
                    ? 'bg-[#9E1B32] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[11px] font-bold text-slate-400">
            {filteredLogs.length} Entries
          </span>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs italic">
              No audit log entries matching &ldquo;{filter}&rdquo;.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const isFlagged = log.validationStatus === 'flagged';

              return (
                <div
                  key={log.id}
                  className={`bg-white rounded-xl border transition-all ${
                    isFlagged
                      ? 'border-amber-300 shadow-2xs'
                      : 'border-slate-200 hover:border-[#E6C66E]/80 shadow-2xs'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(log.id)}
                    className="p-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {log.actionType}
                        </span>
                        {log.validationStatus && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                              log.validationStatus === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {log.validationStatus}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        {isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {log.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-600">{log.actor}</span>
                      </div>
                      {log.ruleEvaluated && (
                        <span className="text-[10px] italic text-[#9E1B32] font-medium">
                          Rule: {log.ruleEvaluated}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Diff Viewer */}
                  {isExpanded && (log.previousValue !== undefined || log.newValue !== undefined) && (
                    <div className="p-3 bg-[#FAF8F5] border-t border-slate-100 rounded-b-xl text-[11px] font-mono space-y-2">
                      <div className="flex items-center gap-1 text-slate-500 font-sans font-semibold text-[10px] uppercase">
                        <Terminal className="w-3 h-3" />
                        <span>State Mutation Diff</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800">
                          <span className="text-[9px] font-bold block text-rose-600 mb-1">PREVIOUS VALUE:</span>
                          <pre className="whitespace-pre-wrap text-[10px]">{JSON.stringify(log.previousValue, null, 2) || 'null'}</pre>
                        </div>
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">
                          <span className="text-[9px] font-bold block text-emerald-600 mb-1">NEW VALUE:</span>
                          <pre className="whitespace-pre-wrap text-[10px]">{JSON.stringify(log.newValue, null, 2) || 'null'}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero-Tamper Validation Active
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
