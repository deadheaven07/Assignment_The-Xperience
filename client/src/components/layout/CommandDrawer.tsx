'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { IEvent, IEventSnapshot, IVendor, ITask, VendorCategory, TaskCategory, TaskPriority } from '@/lib/types';
import {
  X,
  Compass,
  Settings,
  Calendar,
  Kanban,
  Users,
  Bus,
  PieChart,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Crown,
  ChevronDown,
} from 'lucide-react';

interface CommandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: IEvent[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
  snapshot: IEventSnapshot;
  onNavigateTab: (tabKey: string) => void;
  onSendMessage: (message: string) => void;
  onResetEvent: () => void;
  onUpdateEventDetails: (updates: {
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
  }) => Promise<void>;
  onAddTask: (task: Partial<ITask>) => Promise<void>;
  onAddVendor?: (vendor: Partial<IVendor>) => Promise<void>;
  isResetting?: boolean;
}

export const CommandDrawer: React.FC<CommandDrawerProps> = ({
  isOpen,
  onClose,
  events,
  selectedEventId,
  onSelectEvent,
  snapshot,
  onNavigateTab,
  onSendMessage,
  onResetEvent,
  onUpdateEventDetails,
  onAddTask,
  onAddVendor,
  isResetting = false,
}) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'settings'>('hub');

  // Event Settings Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalGuests, setTotalGuests] = useState<number>(400);
  const [budget, setBudget] = useState<number>(7500000);
  const [fleetRequired, setFleetRequired] = useState<number>(200);
  const [fleetAllocated, setFleetAllocated] = useState<number>(150);
  const [roomsRequired, setRoomsRequired] = useState<number>(160);
  const [roomsBooked, setRoomsBooked] = useState<number>(160);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quick Add Custom Task Form State
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('decor');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('high');

  // Quick Add Custom Vendor Form State
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorCategory, setVendorCategory] = useState<VendorCategory>('decor');
  const [vendorCost, setVendorCost] = useState<number>(150000);

  // Populate settings form whenever active event changes
  useEffect(() => {
    if (snapshot?.event) {
      setTitle(snapshot.event.title || '');
      setLocation(snapshot.event.location || '');
      setStartDate(snapshot.event.startDate || '');
      setEndDate(snapshot.event.endDate || '');
      setTotalGuests(snapshot.event.totalGuests || 0);
      setBudget(snapshot.event.budget || 0);
    }
    if (snapshot?.logistics) {
      setFleetRequired(snapshot.logistics.fleetCapacityRequired || 0);
      setFleetAllocated(snapshot.logistics.fleetCapacityAllocated || 0);
      setRoomsRequired(snapshot.logistics.hotelRoomsRequired || 0);
      setRoomsBooked(snapshot.logistics.hotelRoomsBooked || 0);
    }
  }, [snapshot]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentEvent = snapshot?.event;
  const isWedding = currentEvent?.type === 'wedding';

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateEventDetails({
        title,
        location,
        startDate,
        endDate,
        totalGuests: Number(totalGuests),
        budget: Number(budget),
        fleetCapacityRequired: Number(fleetRequired),
        fleetCapacityAllocated: Number(fleetAllocated),
        hotelRoomsRequired: Number(roomsRequired),
        hotelRoomsBooked: Number(roomsBooked),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Quick Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await onAddTask({
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      status: 'todo',
      assignee: 'Event Operations Team',
      dueDate: startDate || '2025-11-14',
    });
    setTaskTitle('');
    setShowTaskForm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Preset runners
  const presets = isWedding
    ? [
        { label: 'Royal Wedding Brief', query: 'Brief: 3-Day Heritage Wedding with 400 Royal Guests' },
        { label: 'Venue Confirmed & Décor', query: 'Update: Sangeet venue confirmed at Taj Palace, floral décor pending' },
        { label: 'Airport Transit & Rooms', query: 'Logistics: Check airport shuttles and royal suite allocations' },
        { label: 'Catering Headcount Lock', query: 'Deadline: Lock catering headcount with Shahi Dawat Caterers by 6 PM' },
        { label: '🚨 Photographer Cancellation', query: 'Crisis: Reception Photographer Drishti Studios notified cancellation' },
      ]
    : [
        { label: 'Corporate Retreat Brief', query: 'Brief: 2-Day Apex Corporate Retreat for 200 Employees' },
        { label: 'Conference Hall Booked', query: 'Update: Main keynote hall confirmed at The Heritage Resort' },
        { label: 'Transit Bus Shortage', query: 'Logistics: Check fleet capacity and bus assignments' },
        { label: 'Team Building Schedule', query: 'Deadline: Finalize Day 2 outdoor activity schedule' },
        { label: '🚨 Shuttle Fleet Deficit', query: 'Crisis: 50 employees lack transport for airport transfers' },
      ];

  const modules = [
    { key: 'timeline', name: 'Timeline & Schedule', icon: Calendar, desc: 'Chronological sub-events' },
    { key: 'kanban', name: 'Smart Kanban Board', icon: Kanban, desc: 'Tasks & operational readiness' },
    { key: 'vendors', name: 'Vendor Procurement', icon: Users, desc: 'Contracts & procurement gaps' },
    { key: 'logistics', name: 'Hospitality & Transit', icon: Bus, desc: 'Rooms, shuttles, fleet' },
    { key: 'budget', name: 'Spend & Budget Analytics', icon: PieChart, desc: 'Department spend & burn' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-out Drawer Container */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border-r border-[#E6C66E]/50 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="p-4 bg-white/95 border-b border-[#E6C66E]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Logo size="sm" variant="horizontal" subtitle="COMMAND CENTER" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Event Context Pill & Scenario Switcher */}
        <div className="px-4 py-3 bg-[#FDFBF2] border-b border-[#E6C66E]/40 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isWedding ? (
              <Crown className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Building2 className="w-4 h-4 text-sky-600" />
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 line-clamp-1">
                {currentEvent?.title}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {currentEvent?.location} • {currentEvent?.totalGuests} Guests
              </span>
            </div>
          </div>

          {/* Quick Scenario Toggle Dropdown */}
          <select
            value={selectedEventId}
            onChange={(e) => onSelectEvent(e.target.value)}
            className="text-xs font-semibold bg-white border border-[#E6C66E] rounded-lg px-2.5 py-1 text-slate-700 hover:border-[#9E1B32] transition-all cursor-pointer focus:outline-hidden"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.type === 'wedding' ? '👑 Wedding (400 PAX)' : '🏢 Retreat (200 PAX)'}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigation (Hub vs Settings) */}
        <div className="grid grid-cols-2 bg-slate-100/80 p-1 border-b border-[#E6C66E]/30 shrink-0">
          <button
            onClick={() => setActiveTab('hub')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'hub'
                ? 'bg-white text-[#9E1B32] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Quick Actions & Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-[#9E1B32] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Event Settings & Details</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-2xs animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Changes successfully saved and synchronized with live cockpit!</span>
          </div>
        )}

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {activeTab === 'hub' ? (
            /* ========================================================= */
            /* TAB 1: QUICK ACTIONS & NAVIGATION HUB                     */
            /* ========================================================= */
            <>
              {/* Telemetry Snapshot Cards */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Live Operational Telemetry
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-3 rounded-xl border border-[#E6C66E]/40 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-semibold">Readiness</span>
                    <p className="text-lg font-black text-[#9E1B32] mt-0.5">
                      {currentEvent?.readinessScore}%
                    </p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-gradient-to-r from-[#D4AF37] to-[#9E1B32] h-full rounded-full"
                        style={{ width: `${currentEvent?.readinessScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#E6C66E]/40 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-semibold">Budget Used</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {Math.round(((currentEvent?.spent || 0) / (currentEvent?.budget || 1)) * 100)}%
                    </p>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      ₹{((currentEvent?.spent || 0) / 100000).toFixed(1)}L / ₹{((currentEvent?.budget || 0) / 100000).toFixed(1)}L
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#E6C66E]/40 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-semibold">Active Risks</span>
                    <p className="text-lg font-black text-amber-600 mt-0.5">
                      {snapshot?.risks?.length || 0}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {snapshot?.risks?.length === 0 ? 'Optimal state' : 'Requires review'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-Click Cockpit Module Jumper */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Jump to Cockpit Module (1-Click)
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {modules.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.key}
                        onClick={() => {
                          onNavigateTab(m.key);
                          onClose();
                        }}
                        className="w-full p-2.5 bg-white hover:bg-[#FDFBF2] border border-[#E6C66E]/40 hover:border-[#9E1B32]/60 rounded-xl transition-all flex items-center justify-between text-left group shadow-2xs cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] group-hover:bg-[#9E1B32]/10 flex items-center justify-center text-[#9E1B32] transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#9E1B32] transition-colors">
                              {m.name}
                            </span>
                            <p className="text-[10px] text-slate-500">{m.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#9E1B32] transition-all transform group-hover:translate-x-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-Click Evaluator Scenarios */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Trigger Assessment Scenario</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </h4>
                <div className="space-y-1.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSendMessage(p.query);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FDFBF2] border border-slate-200 hover:border-[#D4AF37] transition-all flex items-center justify-between shadow-2xs text-xs font-medium text-slate-700 hover:text-[#9E1B32] cursor-pointer"
                    >
                      <span className="line-clamp-1">{p.label}</span>
                      <span className="text-[10px] font-bold text-[#B89428] uppercase shrink-0">
                        Run
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1-Click Scenario Reset */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onResetEvent}
                  disabled={isResetting}
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? 'Resetting Scenario...' : 'Reset Scenario to Pristine Seed State'}</span>
                </button>
              </div>
            </>
          ) : (
            /* ========================================================= */
            /* TAB 2: EVENT SETTINGS & LIVE MODIFIER                     */
            /* ========================================================= */
            <div className="space-y-5">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-[#E6C66E]/40 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Core Event Details</span>
                  </h4>

                  {/* Event Title */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden transition-all"
                      placeholder="e.g. Royal Heritage Wedding"
                      required
                    />
                  </div>

                  {/* Location & Venue */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Venue / Destination
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden transition-all"
                      placeholder="e.g. Taj Jai Mahal Palace, Jaipur"
                      required
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden transition-all"
                        placeholder="e.g. 2025-11-14"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden transition-all"
                        placeholder="e.g. 2025-11-16"
                        required
                      />
                    </div>
                  </div>

                  {/* Guests & Budget Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Total Guests (PAX)
                      </label>
                      <input
                        type="number"
                        value={totalGuests}
                        onChange={(e) => setTotalGuests(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden transition-all"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Budget (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden transition-all"
                        min="10000"
                        step="50000"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Logistics Capacities Form */}
                <div className="bg-white p-4 rounded-xl border border-[#E6C66E]/40 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Transit & Hospitality Allotments</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        Fleet Required (PAX)
                      </label>
                      <input
                        type="number"
                        value={fleetRequired}
                        onChange={(e) => setFleetRequired(Number(e.target.value))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        Fleet Allocated (PAX)
                      </label>
                      <input
                        type="number"
                        value={fleetAllocated}
                        onChange={(e) => setFleetAllocated(Number(e.target.value))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        Hotel Rooms Needed
                      </label>
                      <input
                        type="number"
                        value={roomsRequired}
                        onChange={(e) => setRoomsRequired(Number(e.target.value))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        Hotel Rooms Booked
                      </label>
                      <input
                        type="number"
                        value={roomsBooked}
                        onChange={(e) => setRoomsBooked(Number(e.target.value))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#801426] hover:opacity-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving & Recalculating...' : 'Save & Synchronize Event Details'}</span>
                </button>
              </form>

              {/* Quick Add Custom Task (Collapsible) */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-[#9E1B32]" />
                    <span>Quickly Add Custom Task</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTaskForm ? 'rotate-180' : ''}`} />
                </button>

                {showTaskForm && (
                  <form onSubmit={handleCreateTask} className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Task description (e.g. Arrange 50 welcome garlands)"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-[#9E1B32] focus:outline-hidden"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700"
                      >
                        <option value="decor">Décor</option>
                        <option value="catering">Catering</option>
                        <option value="photography">Photography</option>
                        <option value="logistics">Logistics</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="general">General</option>
                      </select>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700"
                      >
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Insert into Kanban Board
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Footer */}
        <div className="p-3 bg-white border-t border-[#E6C66E]/40 text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-medium">
            PlanCraft AI Executive Cockpit • The Xperience Platform
          </p>
        </div>
      </div>
    </div>
  );
};
