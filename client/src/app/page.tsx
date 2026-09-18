'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
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
      <div className="mb-4">
        <Logo size="xl" variant="vertical" subtitle="THE XPERIENCE • EVENT MANAGEMENT PLATFORM" />
      </div>

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
