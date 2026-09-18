'use client';

import React, { useRef, useEffect } from 'react';
import { IEvent, IChatMessage } from '@/lib/types';
import { EventSwitcher } from './EventSwitcher';
import { ScenarioPresetBar } from './ScenarioPresetBar';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Loader2 } from 'lucide-react';

interface ChatWindowProps {
  events: IEvent[];
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
  onResetEvent: () => void;
  messages: IChatMessage[];
  onSendMessage: (message: string) => void;
  onExecuteAction: (actionType: string, payload?: Record<string, any>) => void;
  isLoading?: boolean;
  isResetting?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  onResetEvent,
  messages,
  onSendMessage,
  onExecuteAction,
  isLoading = false,
  isResetting = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentEvent = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] border-r border-[#E6C66E]/40 overflow-hidden shadow-xs">
      {/* 1. Top Event Switcher */}
      <EventSwitcher
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={onSelectEvent}
        onResetEvent={onResetEvent}
        isResetting={isResetting}
      />

      {/* 2. One-Click Evaluator Scenario Presets */}
      <ScenarioPresetBar
        eventType={currentEvent?.type || 'wedding'}
        onSelectPreset={onSendMessage}
        isLoading={isLoading}
      />

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onExecuteAction={onExecuteAction}
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#E6C66E]/40 max-w-[70%] shadow-2xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#9E1B32]" />
            <span className="text-xs text-slate-500 font-medium">
              PlanCraft AI is analyzing event parameters & updating Cockpit...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Bottom Input Bar */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
