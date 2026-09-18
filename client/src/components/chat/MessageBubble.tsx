'use client';

import React from 'react';
import { IChatMessage } from '@/lib/types';
import { Sparkles, Calendar, Users, Store, ArrowRight, User } from 'lucide-react';

interface MessageBubbleProps {
  message: IChatMessage;
  onExecuteAction?: (actionType: string, payload?: Record<string, any>) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onExecuteAction,
}) => {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex flex-col gap-1.5 ${isAi ? 'items-start' : 'items-end'}`}>
      <div className="flex items-center gap-1.5 px-1">
        {isAi ? (
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#9E1B32]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>PlanCraft AI Co-Pilot</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <User className="w-3 h-3 text-slate-400" />
            <span>Event Lead</span>
          </div>
        )}
        <span className="text-[10px] text-slate-400">• {message.timestamp}</span>
      </div>

      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs transition-all ${
          isAi
            ? 'bg-white text-slate-800 border border-[#E6C66E]/50 shadow-[0_4px_16px_rgba(212,175,55,0.08)] rounded-tl-sm'
            : 'bg-gradient-to-r from-[#9E1B32] to-[#801426] text-white rounded-tr-sm'
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>

        {/* Extracted Entity Chips */}
        {isAi && message.extractedEntities && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5 text-xs">
            {message.extractedEntities.dates?.map((date, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium"
              >
                <Calendar className="w-2.5 h-2.5" />
                {date}
              </span>
            ))}
            {message.extractedEntities.headcounts?.map((hc, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium"
              >
                <Users className="w-2.5 h-2.5" />
                {hc} PAX
              </span>
            ))}
            {message.extractedEntities.vendors?.map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium"
              >
                <Store className="w-2.5 h-2.5" />
                {v}
              </span>
            ))}
          </div>
        )}

        {/* Suggested Action Chips */}
        {isAi && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
            {message.suggestedActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onExecuteAction && onExecuteAction(action.actionType, action.payload)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#FDFBF2] text-[#9E1B32] border border-[#E6C66E] hover:border-[#D4AF37] text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
