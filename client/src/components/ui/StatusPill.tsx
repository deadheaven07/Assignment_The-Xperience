import React from 'react';

interface StatusPillProps {
  status: string;
  className?: string;
  pulse?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  className = '',
  pulse = false,
}) => {
  const norm = status.toLowerCase().replace(/\s+/g, '_');

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (['confirmed', 'done', 'completed', 'contract_signed'].includes(norm)) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (['in_progress', 'upcoming', 'ongoing', 'shortlisted'].includes(norm)) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (['blocked', 'gap', 'critical', 'delayed'].includes(norm)) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (['todo', 'warning', 'under_review'].includes(norm)) {
    colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
    dotColor = 'bg-sky-500';
  }

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      {formatText(status)}
    </span>
  );
};
