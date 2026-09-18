'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to dashboard for smooth reviewer experience
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9E1B32] to-[#801426] flex items-center justify-center text-white shadow-lg mb-4 border border-[#E6C66E]">
        <Crown className="w-8 h-8 text-[#D4AF37]" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        PlanCraft <span className="text-[#9E1B32]">AI</span>
      </h1>
      <p className="text-xs font-bold uppercase tracking-widest text-[#B89428] mb-4">
        The Xperience • Event Management Platform
      </p>

      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        Redirecting to the dual-pane event operations cockpit...
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9E1B32] to-[#801426] text-white font-semibold text-xs shadow-md hover:opacity-95 transition-all"
        >
          <span>Enter Cockpit Now</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E6C66E] text-slate-700 font-semibold text-xs shadow-2xs hover:bg-[#FDFBF2] transition-all"
        >
          <span>Login Screen</span>
        </Link>
      </div>
    </div>
  );
}
