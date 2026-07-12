
import React from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

const statusClasses = {
  Available: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  Completed: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  Active: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  'On Trip': 'border-sky-500/25 bg-sky-500/10 text-sky-300',
  Dispatched: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
  'In Shop': 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  Pending: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  Draft: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
  Retired: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  Suspended: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  Cancelled: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  Error: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  'Off Duty': 'border-zinc-500/25 bg-zinc-500/10 text-zinc-300'
};

export function Button({
  className = '',
  loading,
  disabled,
  variant = 'primary',
  children,
  ...props
}) {
  const variants = {
    primary:
    'bg-[#d98a3d] text-[#171312] hover:bg-[#eca55c] disabled:bg-[#76512f] disabled:text-[#cbb69e]',
    secondary:
    'border border-[#343438] bg-[#202023] text-[#edeae3] hover:bg-[#29292d] disabled:text-zinc-600',
    danger:
    'border border-rose-500/35 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#d98a3d] focus:ring-offset-2 focus:ring-offset-[#141416] disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}>
      
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>);

}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusClasses[status]}`}>
      
      {status}
    </span>);

}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98a3d]">
          {eyebrow}
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-[#edeae3]">
          {title}
        </h1>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
      {action}
    </div>);

}

export function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>);

}

export function Notice({ kind = 'info', children }) {
  const styles =
  kind === 'error' ?
  'border-rose-500/30 bg-rose-500/10 text-rose-200' :
  kind === 'success' ?
  'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' :
  'border-[#343438] bg-[#202023] text-zinc-400';
  const Icon =
  kind === 'error' ? AlertCircle : kind === 'success' ? Check : AlertCircle;

  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`flex gap-2 rounded-md border px-3 py-2.5 text-xs ${styles}`}>
      
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {children}
    </div>);

}

export const inputClass =
'w-full rounded-md border border-[#343438] bg-[#151517] px-3 py-2 text-xs text-[#edeae3] placeholder:text-zinc-600 focus:border-[#d98a3d] focus:outline-none focus:ring-1 focus:ring-[#d98a3d]';