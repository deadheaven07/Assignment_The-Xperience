'use client';

import React from 'react';
import { IVendor } from '@/lib/types';
import { StatusPill } from '@/components/ui/StatusPill';
import { Store, Phone, Mail, IndianRupee, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VendorGridProps {
  vendors: IVendor[];
  onTriggerGapAlert?: (vendorId: string) => void;
}

export const VendorGrid: React.FC<VendorGridProps> = ({
  vendors,
  onTriggerGapAlert,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#9E1B32]" />
            <span>Vendor Procurement & Partner Directory</span>
          </h3>
          <p className="text-xs text-slate-500">
            {vendors.length} primary service partners contracted or under RFP across event categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {vendors.map((vendor) => {
          const isGap = vendor.status === 'gap';

          return (
            <div
              key={vendor.id}
              className={`rounded-xl p-4 transition-all duration-200 flex flex-col justify-between ${
                isGap
                  ? 'bg-rose-50/70 border-2 border-rose-400 shadow-sm'
                  : 'bg-white border border-[#E6C66E]/40 hover:border-[#D4AF37] shadow-2xs hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#9E1B32] border border-[#F7D6DC]">
                    {vendor.category}
                  </span>
                  <StatusPill status={vendor.status} pulse={isGap} />
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {vendor.name}
                </h4>

                <div className="text-xs font-bold text-[#B89428] flex items-center gap-0.5 mb-2.5">
                  <span>{formatCurrency(vendor.cost)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">contracted</span>
                </div>

                {isGap && (
                  <div className="mb-2.5 p-2 rounded-lg bg-rose-100/70 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Vendor gap: immediate replacement needed!</span>
                  </div>
                )}

                {vendor.notes && (
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2 italic">
                    &quot;{vendor.notes}&quot;
                  </p>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>{vendor.contactName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <a
                    href={`tel:${vendor.phone}`}
                    className="flex items-center gap-1 hover:text-[#9E1B32] transition-colors"
                  >
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{vendor.phone}</span>
                  </a>
                  <a
                    href={`mailto:${vendor.email}`}
                    className="flex items-center gap-1 hover:text-[#9E1B32] transition-colors truncate max-w-[120px]"
                  >
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{vendor.email}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
