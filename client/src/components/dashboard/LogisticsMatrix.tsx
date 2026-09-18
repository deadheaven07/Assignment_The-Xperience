'use client';

import React from 'react';
import { ILogistics } from '@/lib/types';
import { Hotel, Car, Users, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LogisticsMatrixProps {
  logistics: ILogistics;
  totalGuests: number;
}

export const LogisticsMatrix: React.FC<LogisticsMatrixProps> = ({
  logistics,
  totalGuests,
}) => {
  const roomPercent = Math.round((logistics.hotelRoomsBooked / (logistics.hotelRoomsRequired || 1)) * 100);
  const shuttlePercent = Math.round((logistics.airportShuttlesAssigned / (logistics.airportShuttlesRequired || 1)) * 100);
  const fleetPercent = Math.round((logistics.fleetCapacityAllocated / (logistics.fleetCapacityRequired || 1)) * 100);

  const hasFleetShortage = logistics.fleetCapacityAllocated < logistics.fleetCapacityRequired;
  const deficitCount = logistics.fleetCapacityRequired - logistics.fleetCapacityAllocated;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Car className="w-4 h-4 text-[#9E1B32]" />
          <span>Hospitality & Transit Logistics Matrix</span>
        </h3>
        <p className="text-xs text-slate-500">
          Real-time reconciliation of accommodations, airport transfers, and group transit capacity.
        </p>
      </div>

      {/* Fleet Capacity Deficit Warning Banner */}
      {hasFleetShortage && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
              Transit Capacity Deficit: {deficitCount} Stranded Attendees
            </h4>
            <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
              Allocated fleet capacity is {logistics.fleetCapacityAllocated} seats, while {logistics.fleetCapacityRequired} attendees require synchronized transit. Use 1-Click Actions on the Risk Radar above to book supplemental tempo traveler fleet or split departure waves.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. Hotel Room Block */}
        <div className="bg-white rounded-xl p-4 border border-[#E6C66E]/40 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Hotel className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Guest Hotel Rooms
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                roomPercent >= 100
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {roomPercent}% Secured
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-800">
                {logistics.hotelRoomsBooked} <span className="text-sm font-normal text-slate-500">/ {logistics.hotelRoomsRequired}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {logistics.outOfTownGuests} Out-of-town guests
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Twin/King suites allocated based on 2:1 guest ratio.
            </p>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, roomPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Airport Shuttles */}
        <div className="bg-white rounded-xl p-4 border border-[#E6C66E]/40 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Car className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Airport Shuttles
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                shuttlePercent >= 100
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {shuttlePercent}% Assigned
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-800">
                {logistics.airportShuttlesAssigned} <span className="text-sm font-normal text-slate-500">/ {logistics.airportShuttlesRequired}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Flight arrivals
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Chauffeur-driven luxury Innovas synced with passenger manifests.
            </p>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, shuttlePercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Bus & Fleet Transit Capacity */}
        <div className={`bg-white rounded-xl p-4 border shadow-2xs flex flex-col justify-between ${
          hasFleetShortage ? 'border-rose-300' : 'border-[#E6C66E]/40'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  hasFleetShortage ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Group Fleet Capacity
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                hasFleetShortage
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {fleetPercent}% Capacity
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-800">
                {logistics.fleetCapacityAllocated} <span className="text-sm font-normal text-slate-500">/ {logistics.fleetCapacityRequired}</span>
              </span>
              <span className={`text-xs font-bold ${hasFleetShortage ? 'text-rose-600' : 'text-slate-500'}`}>
                {hasFleetShortage ? `-${deficitCount} Shortfall` : '100% Covered'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Charter coach seating for group departure from assembly point.
            </p>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  hasFleetShortage
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}
                style={{ width: `${Math.min(100, fleetPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {logistics.notes && (
        <div className="p-3 bg-[#FAF8F5] border border-[#E6C66E]/40 rounded-xl text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Operational Logistics Notes: </span>
          {logistics.notes}
        </div>
      )}
    </div>
  );
};
