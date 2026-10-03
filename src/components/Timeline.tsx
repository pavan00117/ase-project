import React from 'react';
import { PollutionReport } from '../types.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { Check, Clock, User, ShieldAlert } from 'lucide-react';

interface TimelineProps {
  report: PollutionReport;
}

export const Timeline: React.FC<TimelineProps> = ({ report }) => {
  const steps = [
    { title: 'Report Submitted', done: true },
    {
      title: 'Under Review',
      done: ['Under Review', 'Verified', 'Assigned', 'Under Investigation', 'Action Taken', 'Resolved', 'Closed'].includes(
        report.status
      ),
    },
    {
      title: 'Official Verification',
      done: ['Verified', 'Assigned', 'Under Investigation', 'Action Taken', 'Resolved', 'Closed'].includes(report.status),
    },
    {
      title: 'Officer Assigned',
      done: ['Assigned', 'Under Investigation', 'Action Taken', 'Resolved', 'Closed'].includes(report.status),
    },
    {
      title: 'Field Investigation',
      done: ['Under Investigation', 'Action Taken', 'Resolved', 'Closed'].includes(report.status),
    },
    {
      title: 'Remediation Action',
      done: ['Action Taken', 'Resolved', 'Closed'].includes(report.status),
    },
    {
      title: 'Resolved / Closed',
      done: ['Resolved', 'Closed'].includes(report.status),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Stepper Bar */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[620px] justify-between relative px-3">
          {/* Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 border-2 ${
                  st.done
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                {st.done ? <Check className="w-4 h-4 stroke-[3]" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium mt-2 max-w-[80px] leading-tight ${
                  st.done ? 'text-slate-800 font-semibold' : 'text-slate-400'
                }`}
              >
                {st.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* History Log list */}
      <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          Audit & Status Progression Log
        </h4>

        <div className="space-y-4">
          {report.status_history && report.status_history.length > 0 ? (
            report.status_history.map((hist, idx) => (
              <div key={hist.id || idx} className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusBadge status={hist.new_status} size="sm" />
                    <span className="text-xs text-slate-400">
                      {new Date(hist.changed_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{hist.remarks}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    Authorized by: <span className="font-semibold text-slate-700">{hist.changed_by_name}</span> ({hist.changed_by_role})
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">Report registered into municipal environmental registry.</p>
          )}
        </div>
      </div>
    </div>
  );
};
