'use client';

import React from 'react';
import { IEvent } from '@/lib/types';
import { MetricCard } from '@/components/ui/MetricCard';
import { ShieldCheck, IndianRupee, Store, AlertOctagon } from 'lucide-react';

interface MetricsHeaderProps {
  event: IEvent;
  onSelectRisksTab?: () => void;
}

export const MetricsHeader: React.FC<MetricsHeaderProps> = ({
  event,
  onSelectRisksTab,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const budgetSpentPercent = Math.round((event.spent / event.budget) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white/70 backdrop-blur-xs border-b border-[#E6C66E]/40">
      {/* 1. Readiness Health Score */}
      <MetricCard
        title="Event Readiness"
        value={`${event.readinessScore}%`}
        subtitle="Dynamic composite metric"
        icon={<ShieldCheck className="w-5 h-5" />}
        progressPercent={event.readinessScore}
        variant={event.readinessScore > 80 ? 'gold' : 'crimson'}
        badge={
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              event.readinessScore >= 80
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
            }`}
          >
            {event.readinessScore >= 80 ? 'Optimal' : 'Needs Action'}
          </span>
        }
      />

      {/* 2. Budget Allocated vs Spent */}
      <MetricCard
        title="Budget Allocation"
        value={formatCurrency(event.spent)}
        subtitle={`of ${formatCurrency(event.budget)} total cap`}
        icon={<IndianRupee className="w-5 h-5" />}
        progressPercent={budgetSpentPercent}
        variant="default"
        trend={`${budgetSpentPercent}% Committed`}
      />

      {/* 3. Confirmed Vendors */}
      <MetricCard
        title="Procurement Hub"
        value={`${event.confirmedVendorsCount} / ${event.totalVendorsCount}`}
        subtitle="Key contracts confirmed"
        icon={<Store className="w-5 h-5 text-[#9E1B32]" />}
        progressPercent={Math.round((event.confirmedVendorsCount / event.totalVendorsCount) * 100)}
        variant="marigold"
        trend="Active Contracts"
      />

      {/* 4. Critical Discrepancies */}
      <MetricCard
        title="Risk Radar"
        value={`${event.activeRisksCount} ${event.activeRisksCount === 1 ? 'Discrepancy' : 'Discrepancies'}`}
        subtitle={event.activeRisksCount > 0 ? 'Click to inspect & auto-resolve' : 'All clear'}
        icon={<AlertOctagon className="w-5 h-5" />}
        variant={event.activeRisksCount > 0 ? 'crimson' : 'emerald'}
        onClick={onSelectRisksTab}
        badge={
          event.activeRisksCount > 0 ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
              Clear
            </span>
          )
        }
      />
    </div>
  );
};
