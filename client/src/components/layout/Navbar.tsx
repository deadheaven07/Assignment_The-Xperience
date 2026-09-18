'use client';

import React from 'react';
import { Sparkles, Crown, UserCheck, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';

export const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    api.clearToken();
    router.push('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E6C66E]/40 px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
      {/* Redesigned Luxury Brand & Logo */}
      <Logo size="md" />

      {/* User Info & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5] rounded-full border border-[#E6C66E]/40 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700">Ananya Sharma</span>
          <span className="text-slate-400 text-[11px]">(Lead Event Director)</span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out / Switch Session"
          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-500 hover:text-rose-700 transition-all flex items-center gap-1 text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
