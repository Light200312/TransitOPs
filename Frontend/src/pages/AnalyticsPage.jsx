
import React, { useState } from 'react';
import { Download, FileText, Info } from 'lucide-react';
import { Button, Notice, PageHeading } from '../components/ui.jsx';
import { money } from '../data/seed.js';

const revenue = [{ month: 'Jan', amount: 840000 }, { month: 'Feb', amount: 910000 }, { month: 'Mar', amount: 760000 }, { month: 'Apr', amount: 1080000 }, { month: 'May', amount: 1160000 }, { month: 'Jun', amount: 1240000 }, { month: 'Jul', amount: 980000 }];
const costly = [{ vehicle: 'GJ-01-KP-4821', amount: 122400, color: 'bg-[#d98a3d]' }, { vehicle: 'GJ-27-MN-5518', amount: 98400, color: 'bg-sky-400' }, { vehicle: 'GJ-18-AT-9034', amount: 74200, color: 'bg-emerald-400' }, { vehicle: 'GJ-01-VB-7724', amount: 41800, color: 'bg-zinc-500' }];

export function AnalyticsPage() {
  const [notice, setNotice] = useState('');
  const highestRevenue = Math.max(...revenue.map((item) => item.amount));
  const metrics = [{ label: 'Fuel efficiency', value: '6.8', suffix: 'km/l' }, { label: 'Fleet utilization', value: '68', suffix: '%' }, { label: 'Operational cost', value: money(352400), suffix: '' }, { label: 'Vehicle ROI', value: '18.4', suffix: '%' }];

  return (
    <>
      <PageHeading eyebrow="Performance intelligence" title="Reports & analytics" description="Revenue, cost and vehicle efficiency signals for fleet planning." action={<div className="flex gap-2"><Button variant="secondary" onClick={() => setNotice('PDF report preparation queued.')}><FileText className="h-3.5 w-3.5" />PDF</Button><Button onClick={() => setNotice('CSV export downloaded successfully.')}><Download className="h-3.5 w-3.5" />Export CSV</Button></div>} />
      {notice && <div className="mb-4"><Notice kind="success">{notice}</Notice></div>}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4"><p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{metric.label}{metric.label === 'Vehicle ROI' && <span title="(Revenue − (Maintenance + Fuel)) / Acquisition Cost"><Info className="h-3 w-3 text-zinc-600" /></span>}</p><p className="mt-2 text-2xl font-semibold">{metric.value}<span className="ml-1 text-sm text-zinc-500">{metric.suffix}</span></p></article>)}</section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4"><h2 className="text-sm font-semibold">Monthly revenue</h2><p className="mt-1 text-[10px] text-zinc-500">Revenue collected over the last seven months</p><div className="mt-7 flex h-52 items-end gap-3 sm:gap-5">{revenue.map((item) => <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="group relative rounded-t bg-[#d98a3d] transition hover:bg-[#edaa65]" style={{ height: `${item.amount / highestRevenue * 100}%` }} title={`${item.month}: ${money(item.amount)}`}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#27272a] px-1.5 py-1 text-[10px] text-zinc-200 group-hover:block">{money(item.amount)}</span></div><span className="text-center text-[10px] text-zinc-500">{item.month}</span></div>)}</div></section>
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4"><h2 className="text-sm font-semibold">Top costliest vehicles</h2><p className="mt-1 text-[10px] text-zinc-500">Cost total: fuel, service and expenses</p><div className="mt-7 space-y-5">{costly.map((item, index) => <div key={item.vehicle}><div className="mb-1.5 flex justify-between text-xs"><span className="flex gap-2 text-zinc-300"><span className="font-mono text-zinc-600">0{index + 1}</span>{item.vehicle}</span><span>{money(item.amount)}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#27272a]"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.amount / costly[0].amount * 100}%` }} /></div></div>)}</div></section>
      </div>
    </>);

}