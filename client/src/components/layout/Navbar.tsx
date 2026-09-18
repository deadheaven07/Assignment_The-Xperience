'use client';

import React from 'react';
import { Sparkles, Crown, UserCheck, LogOut, PanelLeftOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';

interface NavbarProps {
  onOpenDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDrawer }) => {
  const router = useRouter();

  const handleLogout = () => {
    api.clearToken();
    router.push('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E6C66E]/40 px-4 py-2 flex items-center justify-between z-30 shrink-0">
      {/* Redesigned Luxury Brand & Logo with Click-to-Open Command Center Drawer */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenDrawer}
          title="Click to open Command Center & Event Settings"
          className="group flex items-center gap-2 p-1.5 -ml-1 rounded-xl hover:bg-[#FDFBF2] border border-transparent hover:border-[#E6C66E]/60 transition-all cursor-pointer text-left"
        >
          <Logo size="md" />
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF8F5] group-hover:bg-[#FDFBF2] border border-[#E6C66E]/60 text-[10px] font-bold text-[#B89428] group-hover:text-[#9E1B32] transition-colors">
            <PanelLeftOpen className="w-3 h-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Command Center</span>
          </div>
        </button>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5] rounded-full border border-[#E6C66E]/40 text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">Harsh Raghuwanshi</span>
          <span className="text-slate-400 text-[11px]">(Lead Event Director)</span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out / Switch Session"
          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-500 hover:text-rose-700 transition-all flex items-center gap-1 text-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
