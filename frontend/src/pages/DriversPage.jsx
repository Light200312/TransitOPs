
import React, { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button, Notice, PageHeading, StatusBadge, inputClass } from '../components/ui.jsx';
import * as api from '../api.js';

const emptyForm = {
  name: '',
  license: '',
  category: 'LMV',
  expiry: '',
  contact: '',
  completion: '100',
  safety: '100',
  status: 'Available',
};

export function DriversPage({ drivers, token, reload }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(emptyForm);
  const result = useMemo(() => drivers.filter((driver) => `${driver.name} ${driver.license}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || driver.status === filter)), [drivers, query, filter]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const add = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.license.trim()) {
      setNotice('Driver name and license are required.');
      return;
    }

    setLoading(true);
    setNotice('');
    try {
      await api.createDriver(token, {
        ...form,
        name: form.name.trim(),
        license: form.license.trim(),
        completion: Number(form.completion),
        safety: Number(form.safety),
      });
      setForm(emptyForm);
      await reload();
      setNotice('Driver added to the roster.');
    } catch (err) {
      setNotice(err.message || 'Failed to add driver.');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (driverId) => {
    if (!window.confirm('Delete this driver from the roster?')) return;
    setDeletingId(driverId);
    setNotice('');
    try {
      await api.deleteDriver(token, driverId);
      await reload();
      setNotice('Driver removed.');
    } catch (err) {
      setNotice(err.message || 'Failed to delete driver.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <PageHeading eyebrow="Safety & people" title="Drivers & safety profiles" description="License compliance and live driver availability." />
      {notice && <div className="mb-4"><Notice kind="success">{notice}</Notice></div>}

      <section className="mb-6 rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Add a new driver</h3>
            <p className="text-[11px] text-zinc-500">Create a new driver profile and assign it to future trips.</p>
          </div>
        </div>
        <form onSubmit={add} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Driver name</label>
            <input className={inputClass} value={form.name} onChange={updateField('name')} placeholder="Full name" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">License no.</label>
            <input className={inputClass} value={form.license} onChange={updateField('license')} placeholder="License number" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Category</label>
            <select className={inputClass} value={form.category} onChange={updateField('category')}>
              {['LMV', 'HMV', 'Taxi', 'Bus'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Expiry</label>
            <input className={inputClass} type="date" value={form.expiry} onChange={updateField('expiry')} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Contact</label>
            <input className={inputClass} value={form.contact} onChange={updateField('contact')} placeholder="Phone number" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Completion</label>
            <input className={inputClass} type="number" min="0" max="100" value={form.completion} onChange={updateField('completion')} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Safety</label>
            <input className={inputClass} type="number" min="0" max="100" value={form.safety} onChange={updateField('safety')} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-zinc-500">Status</label>
            <select className={inputClass} value={form.status} onChange={updateField('status')}>
              {['Available', 'On Trip', 'Off Duty', 'Suspended'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <Button type="submit" loading={loading}><Plus className="h-3.5 w-3.5" />Add driver</Button>
          </div>
        </form>
      </section>

      <div className="mb-4 flex flex-col gap-3"><div className="relative max-w-xl"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" /><input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search driver or license number" /></div><div className="flex flex-wrap gap-2">{['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'].map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-[11px] ${filter === item ? 'border-[#d98a3d]/40 bg-[#d98a3d]/10 text-[#e6a25e]' : 'border-[#343438] text-zinc-500 hover:text-zinc-300'}`}>{item}</button>)}</div></div>
      <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]"><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left"><thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500"><tr>{['Driver name', 'License no.', 'Category', 'Expiry', 'Contact', 'Completion', 'Safety', 'Status', 'Actions'].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{result.map((driver) => { const expired = driver.expiry < new Date().toISOString().split('T')[0]; return <tr key={driver.id} className="border-b border-[#27272a] text-xs last:border-0"><td className="px-4 py-3 font-medium">{driver.name}</td><td className="px-4 py-3 font-mono text-zinc-400">{driver.license}</td><td className="px-4 py-3">{driver.category}</td><td className={`px-4 py-3 ${expired ? 'font-medium text-rose-300' : 'text-zinc-400'}`}>{driver.expiry}{expired && ' · Expired'}</td><td className="px-4 py-3 text-zinc-400">{driver.contact}</td><td className="px-4 py-3">{driver.completion}%</td><td className="px-4 py-3">{driver.safety}%</td><td className="px-4 py-3"><StatusBadge status={driver.status} /></td><td className="px-4 py-3"><button type="button" onClick={() => remove(driver.id)} disabled={deletingId === driver.id} className="inline-flex items-center gap-1.5 rounded border border-rose-500/40 px-2.5 py-1.5 text-[11px] text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" />{deletingId === driver.id ? 'Deleting...' : 'Delete'}</button></td></tr>; })}</tbody></table>{result.length === 0 && <div className="py-12 text-center text-xs text-zinc-500">No drivers match your filters.</div>}</div></section>
      <p className="mt-3 text-[11px] text-rose-300">Drivers with an expired license or Suspended status cannot be assigned to a trip.</p>
    </>);

}