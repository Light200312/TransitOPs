
import React, { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/Dialog.jsx';
import { Button, Field, Notice, PageHeading, StatusBadge, inputClass } from '../components/ui.jsx';
import { money } from '../data/seed.js';
import * as api from '../api.js';

const emptyForm = { regNo: '', model: '', type: 'Truck', capacity: '', odometer: '', cost: '', status: 'Available' };

export function FleetPage({ vehicles, token, reload, role }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const result = useMemo(() => vehicles.filter((vehicle) => `${vehicle.regNo} ${vehicle.model}`.toLowerCase().includes(query.toLowerCase()) && (type === 'All' || vehicle.type === type) && (status === 'All' || vehicle.status === status)), [vehicles, query, type, status]);
  const updateForm = (field, value) => {setForm((current) => ({ ...current, [field]: value }));setFormError('');};

  const remove = async (vehicleId) => {
    if (!window.confirm('Delete this vehicle from the registry?')) return;
    setDeletingId(vehicleId);
    setNotice('');
    try {
      await api.deleteVehicle(token, vehicleId);
      await reload();
      setNotice('Vehicle removed.');
    } catch (err) {
      setNotice(err.message || 'Failed to delete vehicle.');
    } finally {
      setDeletingId(null);
    }
  };

  const add = async (event) => {
    event.preventDefault();
    const regNo = form.regNo.trim().toUpperCase();
    const model = form.model.trim();
    if (!regNo || !model || !form.capacity || !form.odometer || !form.cost) {setFormError('Complete all vehicle details before adding it to the registry.');return;}
    if (vehicles.some((vehicle) => vehicle.regNo.toLowerCase() === regNo.toLowerCase())) {setFormError('This registration number already exists. Registration numbers must be unique.');return;}
    setLoading(true);
    try {
      await api.createVehicle(token, {
        regNo, model, type: form.type,
        capacity: Number(form.capacity), odometer: Number(form.odometer),
        cost: Number(form.cost), status: form.status, region: 'Ahmedabad Hub',
      });
      await reload();
      setIsAddOpen(false);
      setNotice(`Vehicle ${regNo} added to the registry.`);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message || 'Failed to add vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeading eyebrow="Fleet control" title="Vehicle registry" description="Manage fleet availability, asset details and dispatch eligibility." action={<Button onClick={() => setIsAddOpen(true)}><Plus className="h-3.5 w-3.5" />Add vehicle</Button>} />
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}><DialogContent><form onSubmit={add}><DialogHeader><DialogTitle>Add vehicle</DialogTitle><DialogDescription>Register a fleet asset and define its initial dispatch status.</DialogDescription></DialogHeader><div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Registration number"><input className={inputClass} value={form.regNo} onChange={(event) => updateForm('regNo', event.target.value)} placeholder="GJ-01-AB-1234" autoFocus /></Field>
        <Field label="Name / model"><input className={inputClass} value={form.model} onChange={(event) => updateForm('model', event.target.value)} placeholder="e.g. Tata Prima 5530" /></Field>
        <Field label="Vehicle type"><select className={inputClass} value={form.type} onChange={(event) => updateForm('type', event.target.value)}>{['Truck', 'Van', 'Mini'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Initial status"><select className={inputClass} value={form.status} onChange={(event) => updateForm('status', event.target.value)}>{['Available', 'On Trip', 'In Shop', 'Retired'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Capacity (kg)"><input className={inputClass} value={form.capacity} onChange={(event) => updateForm('capacity', event.target.value)} type="number" min="0" /></Field>
        <Field label="Odometer (km)"><input className={inputClass} value={form.odometer} onChange={(event) => updateForm('odometer', event.target.value)} type="number" min="0" /></Field>
        <div className="sm:col-span-2"><Field label="Acquisition cost (₹)"><input className={inputClass} value={form.cost} onChange={(event) => updateForm('cost', event.target.value)} type="number" min="0" /></Field></div>
      </div>{formError && <div className="mt-4"><Notice kind="error">{formError}</Notice></div>}<DialogFooter><Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button type="submit" loading={loading}>Add to registry</Button></DialogFooter></form></DialogContent></Dialog>
      {notice && <div className="mb-4"><Notice kind="success">{notice}</Notice></div>}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} className={`${inputClass} pl-9`} placeholder="Search registration no. or model" /></div><select className={inputClass} value={type} onChange={(event) => setType(event.target.value)}>{['All', 'Truck', 'Van', 'Mini'].map((item) => <option key={item}>{item}</option>)}</select><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}>{['All', 'Available', 'On Trip', 'In Shop', 'Retired'].map((item) => <option key={item}>{item}</option>)}</select></div>
      <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              <tr>
                {(() => {
                  const cols = ['Reg no.', 'Name / model', 'Type', 'Capacity', 'Odometer', 'Acquisition cost', 'Status'];
                  if (role === 'Fleet Manager') cols.push('Actions');
                  return cols.map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>);
                })()}
              </tr>
            </thead>
            <tbody>
              {result.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-[#27272a] text-xs last:border-0">
                  <td className="px-4 py-3 font-mono text-[#e6a25e]">{vehicle.regNo}</td>
                  <td className="px-4 py-3 font-medium">{vehicle.model}</td>
                  <td className="px-4 py-3 text-zinc-400">{vehicle.type}</td>
                  <td className="px-4 py-3">{vehicle.capacity.toLocaleString('en-IN')} kg</td>
                  <td className="px-4 py-3 text-zinc-400">{vehicle.odometer.toLocaleString('en-IN')} km</td>
                  <td className="px-4 py-3">{money(vehicle.cost)}</td>
                  <td className="px-4 py-3"><StatusBadge status={vehicle.status} /></td>
                  {role === 'Fleet Manager' && (
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => remove(vehicle.id)}
                        disabled={deletingId === vehicle.id}
                        className="inline-flex items-center gap-1.5 rounded border border-rose-500/40 px-2.5 py-1.5 text-[11px] text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === vehicle.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {result.length === 0 && <div className="py-12 text-center text-xs text-zinc-500">No vehicles match your filters.</div>}
        </div>
      </section>
      <p className="mt-3 text-[11px] text-rose-300">Registration numbers must be unique. Retired and In Shop vehicles are excluded from the Trip Dispatcher.</p>
    </>);

}