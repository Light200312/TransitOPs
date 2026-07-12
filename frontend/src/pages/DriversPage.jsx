
import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Notice, PageHeading, StatusBadge, inputClass } from '../components/ui.jsx';
import * as api from '../api.js';

export function DriversPage({ drivers, token, reload }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const result = useMemo(() => drivers.filter((driver) => `${driver.name} ${driver.license}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || driver.status === filter)), [drivers, query, filter]);

  const add = async () => {
    setLoading(true);
    try {
      await api.createDriver(token, {
        name: 'Prakash Patel', license: 'GJ-01-20200912987', category: 'LMV',
        expiry: '2028-12-10', contact: '+91 98790 12345', completion: 100, safety: 96, status: 'Available',
      });
      await reload();
      setNotice('Prakash Patel added to the driver roster.');
    } catch (err) {
      setNotice(err.message || 'Failed to add driver.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeading eyebrow="Safety & people" title="Drivers & safety profiles" description="License compliance and live driver availability." action={<Button onClick={add} loading={loading}><Plus className="h-3.5 w-3.5" />Add driver</Button>} />
      {notice && <div className="mb-4"><Notice kind="success">{notice}</Notice></div>}
      <div className="mb-4 flex flex-col gap-3"><div className="relative max-w-xl"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" /><input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search driver or license number" /></div><div className="flex flex-wrap gap-2">{['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-[11px] ${filter === item ? 'border-[#d98a3d]/40 bg-[#d98a3d]/10 text-[#e6a25e]' : 'border-[#343438] text-zinc-500 hover:text-zinc-300'}`}>{item}</button>)}</div></div>
      <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]"><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left"><thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500"><tr>{['Driver name', 'License no.', 'Category', 'Expiry', 'Contact', 'Completion', 'Safety', 'Status'].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{result.map((driver) => {const expired = driver.expiry < new Date().toISOString().split('T')[0];return <tr key={driver.id} className="border-b border-[#27272a] text-xs last:border-0"><td className="px-4 py-3 font-medium">{driver.name}</td><td className="px-4 py-3 font-mono text-zinc-400">{driver.license}</td><td className="px-4 py-3">{driver.category}</td><td className={`px-4 py-3 ${expired ? 'font-medium text-rose-300' : 'text-zinc-400'}`}>{driver.expiry}{expired && ' · Expired'}</td><td className="px-4 py-3 text-zinc-400">{driver.contact}</td><td className="px-4 py-3">{driver.completion}%</td><td className="px-4 py-3">{driver.safety}%</td><td className="px-4 py-3"><StatusBadge status={driver.status} /></td></tr>;})}</tbody></table>{result.length === 0 && <div className="py-12 text-center text-xs text-zinc-500">No drivers match your filters.</div>}</div></section>
      <p className="mt-3 text-[11px] text-rose-300">Drivers with an expired license or Suspended status cannot be assigned to a trip.</p>
    </>);

}