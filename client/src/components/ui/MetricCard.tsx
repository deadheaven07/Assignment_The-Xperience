import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  badge?: React.ReactNode;
  progressPercent?: number;
  variant?: 'gold' | 'crimson' | 'marigold' | 'emerald' | 'default';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  badge,
  progressPercent,
  variant = 'default',
  onClick,
}) => {
  const borderColors = {
    gold: 'hover:border-[#D4AF37] border-[#E6C66E]/50',
    crimson: 'hover:border-[#9E1B32] border-[#F7D6DC]',
    marigold: 'hover:border-[#EAA221] border-[#F9DCB0]',
    emerald: 'hover:border-emerald-500 border-emerald-200',
    default: 'hover:border-[#D4AF37]/70 border-[#E6C66E]/40',
  };

  const iconBg = {
    gold: 'bg-[#FDFBF2] text-[#B89428]',
    crimson: 'bg-[#FDF2F4] text-[#9E1B32]',
    marigold: 'bg-[#FEF6E9] text-[#EAA221]',
    emerald: 'bg-emerald-50 text-emerald-700',
    default: 'bg-[#FAF8F5] text-[#9E1B32]',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border shadow-xs transition-all duration-200 ${
        borderColors[variant]
      } ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${iconBg[variant]}`}>
            {icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
        </div>
        {badge}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl font-bold tracking-tight text-slate-800">
          {value}
        </div>
        {trend && (
          <span className="text-xs font-medium text-slate-500">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{subtitle}</p>
      )}

      {progressPercent !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                variant === 'crimson'
                  ? 'bg-[#9E1B32]'
                  : variant === 'marigold'
                  ? 'bg-[#EAA221]'
                  : variant === 'emerald'
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-[#E6C66E] to-[#D4AF37]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
