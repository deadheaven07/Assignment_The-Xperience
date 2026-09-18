import React from 'react';

interface GoldBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'crimson' | 'marigold' | 'slate';
  className?: string;
  icon?: React.ReactNode;
}

export const GoldBadge: React.FC<GoldBadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
  icon,
}) => {
  const variantStyles = {
    gold: 'bg-[#FDFBF2] text-[#B89428] border border-[#E6C66E]/70 shadow-xs',
    crimson: 'bg-[#FDF2F4] text-[#9E1B32] border border-[#F7D6DC] shadow-xs',
    marigold: 'bg-[#FEF6E9] text-[#B7791F] border border-[#F9DCB0] shadow-xs',
    slate: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] shadow-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="text-[11px]">{icon}</span>}
      {children}
    </span>
  );
};
