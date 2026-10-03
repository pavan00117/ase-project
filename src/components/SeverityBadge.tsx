import React from 'react';
import { SeverityLevel } from '../types.ts';
import { AlertCircle, AlertTriangle, Flame, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const config: Record<
    SeverityLevel,
    { bg: string; text: string; border: string; label: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Low Severity',
      icon: Info,
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'Medium Severity',
      icon: AlertCircle,
    },
    high: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      label: 'High Severity',
      icon: AlertTriangle,
    },
    critical: {
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      border: 'border-rose-300 font-bold animate-pulse',
      label: 'CRITICAL',
      icon: Flame,
    },
  };

  const current = config[severity] || config.medium;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs font-semibold px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border uppercase tracking-wider ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
};
