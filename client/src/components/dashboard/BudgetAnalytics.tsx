'use client';

import React from 'react';
import { IEvent, IVendor } from '@/lib/types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { IndianRupee, PieChart as PieIcon, TrendingUp, AlertCircle } from 'lucide-react';

interface BudgetAnalyticsProps {
  event: IEvent;
  vendors: IVendor[];
}

const PALETTE = [
  '#9E1B32', // Royal Crimson
  '#D4AF37', // Champagne Gold
  '#EAA221', // Festive Marigold
  '#801426', // Deep Wine
  '#2563EB', // Sapphire Blue
  '#059669', // Emerald
  '#7C3AED', // Royal Purple
];

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({
  event,
  vendors,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Aggregate spend by vendor category
  const categoryMap: Record<string, number> = {};
  vendors.forEach((v) => {
    if (v.status !== 'gap') {
      const cat = v.category.charAt(0).toUpperCase() + v.category.slice(1);
      categoryMap[cat] = (categoryMap[cat] || 0) + v.cost;
    }
  });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(categoryMap).map(([category, spent]) => {
    // Allocation estimate (spent + 15% planned buffer)
    const allocated = Math.round(spent * 1.15);
    return {
      category,
      Spent: spent,
      Allocated: allocated,
    };
  });

  const remainingBudget = Math.max(0, event.budget - event.spent);
  const percentSpent = Math.round((event.spent / event.budget) * 100);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-[#9E1B32]" />
            <span>Financial Cockpit & Spend Analytics</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time financial reconciliation, category variances, and contingency burn rate.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-[#E6C66E]/40 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Approved Event Budget Cap
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {formatCurrency(event.budget)}
          </span>
          <span className="text-xs text-slate-500 mt-0.5 block">
            Fixed overall allocation
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-[#E6C66E]/40 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Committed Vendor Spend
          </span>
          <span className="text-xl font-bold text-[#9E1B32] mt-1 block">
            {formatCurrency(event.spent)}
          </span>
          <span className="text-xs text-slate-500 mt-0.5 block">
            {percentSpent}% of total budget committed
          </span>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-[#E6C66E]/40 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Unallocated Contingency Buffer
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">
            {formatCurrency(remainingBudget)}
          </span>
          <span className="text-xs text-slate-500 mt-0.5 block">
            Available for risk mitigation
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut Chart: Spend by Category */}
        <div className="bg-white rounded-xl p-4 border border-[#E6C66E]/40 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-[#B89428]" />
              Spend Distribution by Department
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PALETTE[index % PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6C66E',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-slate-100">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1 text-[11px] text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Committed vs Allocated */}
        <div className="bg-white rounded-xl p-4 border border-[#E6C66E]/40 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#9E1B32]" />
              Category Spend vs Budget Allocation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748B' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6C66E',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Spent" fill="#9E1B32" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Allocated" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
