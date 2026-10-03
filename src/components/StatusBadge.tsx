import React from 'react';
import { ReportStatus } from '../types.ts';
import { Clock, Eye, CheckCircle2, XCircle, UserCheck, Search, Wrench, ShieldCheck, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<
    ReportStatus,
    { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    Submitted: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: Clock,
    },
    'Under Review': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: Eye,
    },
    Verified: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: CheckCircle2,
    },
    Rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: XCircle,
    },
    Assigned: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
      icon: UserCheck,
    },
    'Under Investigation': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-300',
      icon: Search,
    },
    'Action Taken': {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-400',
      icon: Wrench,
    },
    Resolved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: ShieldCheck,
    },
    Closed: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-700',
      border: 'border-zinc-300',
      icon: Archive,
    },
  };

  const current = config[status] || config.Submitted;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium uppercase tracking-wider ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {status}
    </span>
  );
};
