'use client';

import React, { useState } from 'react';
import { Send, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
}) => {
  const [text, setText] = useState('');
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleAudioSimulation = () => {
    if (isSimulatingAudio) {
      setIsSimulatingAudio(false);
    } else {
      setIsSimulatingAudio(true);
      // Simulate speech to text after 2 seconds
      setTimeout(() => {
        setText('Crisis: Reception Photographer Drishti Studios notified cancellation. Need emergency backup options!');
        setIsSimulatingAudio(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-[#E6C66E]/40 p-3 pb-4 flex flex-col gap-2 relative z-20">
      {isSimulatingAudio && (
        <div className="flex items-center justify-center gap-2 py-1 px-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>Listening & transcribing voice instructions...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={toggleAudioSimulation}
          title={isSimulatingAudio ? 'Stop Recording' : 'Simulate Voice Input'}
          className={`p-2.5 rounded-xl border transition-all shrink-0 ${
            isSimulatingAudio
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'border-slate-200 text-slate-500 hover:text-[#9E1B32] hover:bg-[#FDF2F4] hover:border-[#F7D6DC]'
          }`}
        >
          {isSimulatingAudio ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            placeholder="Instruct PlanCraft AI (e.g. 'Add task for Sangeet DJ' or click presets above)..."
            className="w-full bg-[#FAF8F5] text-slate-800 text-sm rounded-xl px-3.5 py-2.5 border border-[#E6C66E]/50 focus:outline-hidden focus:ring-2 focus:ring-[#9E1B32]/30 focus:border-[#9E1B32] resize-none transition-all placeholder:text-slate-400 max-h-24 overflow-y-auto"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#801426] text-white hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
          ) : (
            <Send className="w-4 h-4 text-[#FAF8F5]" />
          )}
        </button>
      </form>
    </div>
  );
};
