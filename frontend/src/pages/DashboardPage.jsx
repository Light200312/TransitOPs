
import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Filter } from 'lucide-react';
import { PageHeading, StatusBadge } from '../components/ui.jsx';

export function DashboardPage({ vehicles, drivers, trips }) {
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');
  const filtered = useMemo(() => vehicles.filter((vehicle) => (type === 'All' || vehicle.type === type) && (status === 'All' || vehicle.status === status) && (region === 'All' || vehicle.region === region)), [vehicles, type, status, region]);
  const metrics = [
  ['Active vehicles', vehicles.filter((v) => v.status !== 'Retired').length, ''],
  ['Available now', vehicles.filter((v) => v.status === 'Available').length, 'text-emerald-300'],
  ['In maintenance', vehicles.filter((v) => v.status === 'In Shop').length, 'text-amber-300'],
  ['Active trips', trips.filter((t) => t.status === 'Dispatched' || t.status === 'On Trip').length, 'text-sky-300'],
  ['Pending trips', trips.filter((t) => t.status === 'Draft').length, ''],
  ['Drivers on duty', drivers.filter((d) => d.status === 'Available' || d.status === 'On Trip').length, ''],
  ['Fleet utilization', '68%', 'text-emerald-300']];

  const counts = [
  ['Available', 'bg-emerald-400'],
  ['On Trip', 'bg-sky-400'],
  ['In Shop', 'bg-amber-400'],
  ['Retired', 'bg-rose-400']].
  map(([label, color]) => ({ label, color, value: vehicles.filter((v) => v.status === label).length }));

  return (
    <>
      <PageHeading eyebrow="Operations overview" title="Dashboard" description={`Live fleet view · ${filtered.length} vehicles matching current filters`} />
      <div className="mb-5 flex flex-wrap gap-2 rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-3">
        <Filter className="m-2 h-3.5 w-3.5 text-zinc-500" />
        {[[type, setType, ['All', 'Truck', 'Van', 'Mini']], [status, setStatus, ['All', 'Available', 'On Trip', 'In Shop']], [region, setRegion, ['All', 'Ahmedabad Hub', 'Gandhinagar Depot', 'Kalol Depot']]].map(([value, setter, options], index) =>
        <select aria-label={['Vehicle type', 'Status', 'Region'][index]} key={index} className="rounded-md border border-[#343438] bg-[#151517] px-3 py-2 text-xs text-zinc-300" value={value} onChange={(event) => setter(event.target.value)}>
            {options.map((option) => <option key={option}>{option}</option>)}
          </select>
        )}
      </div>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {metrics.map(([label, value, accent]) => <article key={label} className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-3.5"><p className="min-h-[28px] text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">{label}</p><p className={`mt-1 text-2xl font-semibold tracking-tight ${accent || 'text-[#edeae3]'}`}>{value}</p></article>)}
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_0.8fr]">
        <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]">
          <div className="flex items-center justify-between border-b border-[#2a2a2d] px-4 py-3.5"><div><h2 className="text-sm font-semibold">Recent trips</h2><p className="mt-1 text-[10px] text-zinc-500">Latest dispatch activity across depots</p></div><ArrowUpRight className="h-4 w-4 text-[#d98a3d]" /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left"><thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500"><tr>{['Trip ID', 'Vehicle', 'Driver', 'Status', 'ETA'].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{trips.map((trip) => <tr key={trip.id} className="border-b border-[#27272a] text-xs last:border-0"><td className="px-4 py-3 font-mono text-[#e6a25e]">{trip.id}</td><td className="px-4 py-3">{vehicles.find((v) => v.id === trip.vehicleId)?.regNo}</td><td className="px-4 py-3 text-zinc-400">{drivers.find((d) => d.id === trip.driverId)?.name}</td><td className="px-4 py-3"><StatusBadge status={trip.status} /></td><td className="px-4 py-3 text-zinc-400">{trip.eta}</td></tr>)}</tbody></table></div>
        </section>
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4"><h2 className="text-sm font-semibold">Vehicle status</h2><p className="mt-1 text-[10px] text-zinc-500">Current fleet allocation</p><div className="mt-7 flex h-3 overflow-hidden rounded-full">{counts.map((count) => <div key={count.label} style={{ width: `${count.value / vehicles.length * 100}%` }} className={count.color} />)}</div><div className="mt-6 space-y-4">{counts.map((count) => <div key={count.label} className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-zinc-400"><i className={`h-2 w-2 rounded-full ${count.color}`} />{count.label}</span><span className="font-mono text-xs">{count.value}</span></div>)}</div></section>
      </div>
    </>);

}