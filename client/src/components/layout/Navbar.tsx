'use client';

import React, { useState } from 'react';
import { Sparkles, UserCheck, LogOut, PanelLeftOpen, Bell, Sliders, FileText, ShieldCheck, Check, Clock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';
import { INotification, EventLifecycleStage } from '@/lib/types';

interface NavbarProps {
  onOpenDrawer?: () => void;
  onOpenWhatIf?: () => void;
  onOpenBriefing?: () => void;
  onOpenAuditLogs?: () => void;
  notifications?: INotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  lifecycleStage?: EventLifecycleStage;
  onUpdateLifecycleStage?: (stage: EventLifecycleStage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDrawer,
  onOpenWhatIf,
  onOpenBriefing,
  onOpenAuditLogs,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  lifecycleStage = 'planning',
  onUpdateLifecycleStage,
}) => {
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = () => {
    api.clearToken();
    router.push('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const stages: { key: EventLifecycleStage; label: string }[] = [
    { key: 'planning', label: '1. Planning' },
    { key: 'vendor_confirmation', label: '2. Vendor Lock' },
    { key: 'execution', label: '3. Execution' },
    { key: 'contingency_handling', label: '4. Contingency' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E6C66E]/40 px-3 sm:px-4 py-2 flex items-center justify-between z-30 shrink-0 relative">
      {/* Brand & Command Drawer Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          title="Click to open Command Center & Event Settings"
          className="group flex items-center gap-2 p-1.5 -ml-1 rounded-xl hover:bg-[#FDFBF2] border border-transparent hover:border-[#E6C66E]/60 transition-all cursor-pointer text-left"
        >
          <Logo size="md" />
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF8F5] group-hover:bg-[#FDFBF2] border border-[#E6C66E]/60 text-[10px] font-bold text-[#B89428] group-hover:text-[#9E1B32] transition-colors">
            <PanelLeftOpen className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Command Center</span>
          </div>
        </button>
      </div>

      {/* Center: Event Lifecycle Stepper */}
      <div className="hidden xl:flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-full border border-[#E6C66E]/40 shadow-2xs">
        {stages.map((stg) => {
          const isActive = lifecycleStage === stg.key;
          return (
            <button
              key={stg.key}
              onClick={() => onUpdateLifecycleStage?.(stg.key)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-[#9E1B32] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {stg.label}
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* What-If Simulator Trigger */}
        <button
          onClick={onOpenWhatIf}
          title="Open What-If Scenario Simulator"
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#D4AF37] bg-white hover:bg-[#FDFBF2] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-[#9E1B32]" />
          <span className="hidden md:inline">What-If Sim</span>
        </button>

        {/* 1-Click Executive Daily Briefing */}
        <button
          onClick={onOpenBriefing}
          title="Generate Executive Daily Briefing"
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#D4AF37] bg-white hover:bg-[#FDFBF2] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#B89428]" />
          <span className="hidden md:inline">Briefing</span>
        </button>

        {/* Audit Logs Trigger */}
        <button
          onClick={onOpenAuditLogs}
          title="Inspect Operational Audit Trail & Rule Log"
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#D4AF37] bg-white hover:bg-[#FDFBF2] text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline">Audit Trail</span>
        </button>

        {/* Notifications Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-1.5 rounded-xl border border-slate-200 hover:border-[#D4AF37] bg-white hover:bg-[#FDFBF2] text-slate-600 relative transition-all shadow-2xs cursor-pointer"
            title="Live Operational Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-3 bg-[#FAF8F5] border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Bell className="w-3.5 h-3.5 text-[#9E1B32]" />
                  <span>Real-Time Notifications ({unreadCount} unread)</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => onMarkAllNotificationsRead?.()}
                    className="text-[10px] font-semibold text-[#9E1B32] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 italic">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead?.(n.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        n.read
                          ? 'bg-white border-slate-100 text-slate-500'
                          : 'bg-rose-50/40 border-rose-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            n.type === 'crisis' || n.type === 'error'
                              ? 'bg-rose-100 text-rose-800'
                              : n.type === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {n.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <h6 className="text-xs font-bold leading-snug">{n.title}</h6>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 bg-[#FAF8F5] border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5] rounded-full border border-[#E6C66E]/40 text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">Harsh Raghuwanshi</span>
          <span className="text-slate-400 text-[11px]">(Lead Event Director)</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign Out / Switch Session"
          className="p-1.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-500 hover:text-rose-700 transition-all flex items-center gap-1 text-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
