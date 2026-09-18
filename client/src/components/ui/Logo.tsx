'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  subtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'horizontal',
  subtitle = 'BY THE XPERIENCE',
}) => {
  const dimensions = {
    sm: { box: 'w-7 h-7', text: 'text-sm', badge: 'text-[9px]', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', text: 'text-base', badge: 'text-[10px]', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', badge: 'text-xs', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', badge: 'text-sm', sub: 'text-xs' },
  };

  const dim = dimensions[size];

  // The Master Emblem SVG
  const emblem = (
    <div className={`relative ${dim.box} shrink-0 group transition-all duration-300 hover:scale-105 select-none`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(158,27,50,0.22)]"
      >
        <defs>
          {/* Royal Crimson Velvet Gradient */}
          <linearGradient id="crimsonVelvet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A81D36" />
            <stop offset="45%" stopColor="#871224" />
            <stop offset="100%" stopColor="#590A17" />
          </linearGradient>

          {/* 24K Champagne Imperial Gold Gradient */}
          <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#ECC867" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#B38E22" />
            <stop offset="100%" stopColor="#876712" />
          </linearGradient>

          {/* Bright Gold Highlight */}
          <linearGradient id="goldGleam" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F9E08A" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4D36B" />
          </linearGradient>

          {/* Radiant Core AI Glow */}
          <radialGradient id="aiStarlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFECA8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>

          {/* Royal Drop Shadow */}
          <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 1. Outer Gilded Medallion Frame (Faceted Royal Octagon Shield) */}
        <path
          d="M36 6 L84 6 L114 36 L114 84 L84 114 L36 114 L6 84 L6 36 Z"
          fill="url(#crimsonVelvet)"
          stroke="url(#imperialGold)"
          strokeWidth="2.75"
        />

        {/* 2. Delicate Inlaid Filigree Octagon Ring */}
        <path
          d="M40 13 L80 13 L107 40 L107 80 L80 107 L40 107 L13 80 L13 40 Z"
          fill="none"
          stroke="url(#imperialGold)"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.65"
        />

        {/* 3. Corner Accent Jewels (Four Cardinal Dots) */}
        <circle cx="60" cy="10" r="1.8" fill="#FFF2B2" />
        <circle cx="110" cy="60" r="1.8" fill="#FFF2B2" />
        <circle cx="60" cy="110" r="1.8" fill="#FFF2B2" />
        <circle cx="10" cy="60" r="1.8" fill="#FFF2B2" />

        {/* 4. Imperial Heritage Crown (Pinnacle of Medallion) */}
        <g filter="url(#goldShadow)">
          {/* Crown Base Band */}
          <path
            d="M44 33 C52 31, 68 31, 76 33 L75 35 C68 33.5, 52 33.5, 45 35 Z"
            fill="url(#imperialGold)"
          />
          {/* Crown Spikes: 5 Royal Pinnacles */}
          <path
            d="M43 33 L41 24 L49 28 L60 18 L71 28 L79 24 L77 33 C69 31, 51 31, 43 33 Z"
            fill="url(#imperialGold)"
            stroke="url(#goldGleam)"
            strokeWidth="0.5"
          />
          {/* Crown Jewels on Spikes */}
          <circle cx="41" cy="23" r="1.5" fill="#FFFFFF" />
          <circle cx="49" cy="27" r="1.2" fill="#FFECA8" />
          <circle cx="60" cy="17" r="2.2" fill="#FFFFFF" />
          <circle cx="71" cy="27" r="1.2" fill="#FFECA8" />
          <circle cx="79" cy="23" r="1.5" fill="#FFFFFF" />
        </g>

        {/* 5. The Intertwined Signature "X" Monogram (The Xperience Silk Ribbons) */}
        <g filter="url(#goldShadow)">
          {/* Left-top to Right-bottom Ribbon */}
          <path
            d="M34 38 C44 48, 76 72, 86 82 C84 84, 80 86, 76 86 C68 78, 40 50, 32 42 Z"
            fill="url(#imperialGold)"
            opacity="0.95"
          />
          {/* Right-top to Left-bottom Ribbon (Folded over with arch contrast) */}
          <path
            d="M86 38 C76 48, 44 72, 34 82 C36 84, 40 86, 44 86 C52 78, 80 50, 88 42 Z"
            fill="url(#imperialGold)"
            opacity="0.95"
          />
          {/* Subtle Ribbon Highlighting Lines */}
          <path
            d="M33 40 C43 50, 77 74, 87 84"
            stroke="url(#goldGleam)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M87 40 C77 50, 43 74, 33 84"
            stroke="url(#goldGleam)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>

        {/* 6. Sacred Lotus Blossom Pedestal at Base */}
        <g filter="url(#goldShadow)">
          {/* Center Lotus Petal */}
          <path
            d="M60 88 C57 93, 58 98, 60 102 C62 98, 63 93, 60 88 Z"
            fill="url(#imperialGold)"
          />
          {/* Left Petal */}
          <path
            d="M58 91 C53 93, 50 97, 51 100 C55 99, 58 96, 59 93 Z"
            fill="url(#imperialGold)"
            opacity="0.9"
          />
          {/* Right Petal */}
          <path
            d="M62 91 C67 93, 70 97, 69 100 C65 99, 62 96, 61 93 Z"
            fill="url(#imperialGold)"
            opacity="0.9"
          />
        </g>

        {/* 7. Radiant AI Stella Core (Central 8-Point Diamond Sparkle) */}
        <g>
          {/* Soft Starlight Flare */}
          <circle cx="60" cy="60" r="14" fill="url(#aiStarlight)" />

          {/* Vertical & Horizontal Spikes */}
          <path
            d="M60 47 L62.2 57.8 L73 60 L62.2 62.2 L60 73 L57.8 62.2 L47 60 L57.8 57.8 Z"
            fill="#FFFFFF"
            stroke="url(#imperialGold)"
            strokeWidth="0.6"
          />
          {/* Diagonal Secondary Diamond Spikes */}
          <path
            d="M60 52 L61.5 58.5 L68 60 L61.5 61.5 L60 68 L58.5 61.5 L52 60 L58.5 58.5 Z"
            fill="url(#imperialGold)"
            transform="rotate(45 60 60)"
          />
          {/* Core White Diamond Center */}
          <circle cx="60" cy="60" r="1.8" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );

  if (variant === 'icon-only' || !showText) {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        {emblem}
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight text-slate-900 ${dim.text}`}>
              PlanCraft <span className="text-[#9E1B32]">AI</span>
            </span>
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FDFBF2] border border-[#E6C66E] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E1B32] animate-pulse" />
            <span className={`font-bold tracking-widest text-[#B89428] uppercase ${dim.badge}`}>
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Horizontal Layout
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {emblem}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-slate-900 ${dim.text}`}>
            PlanCraft <span className="text-[#9E1B32]">AI</span>
          </span>
          <span className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDFBF2] text-[#B89428] border border-[#E6C66E] shadow-2xs ${dim.badge}`}>
            {subtitle}
          </span>
        </div>
        <span className={`text-slate-500 font-medium tracking-tight hidden sm:block ${dim.sub}`}>
          Autonomous Multi-Scenario Event Management Platform
        </span>
      </div>
    </div>
  );
};
