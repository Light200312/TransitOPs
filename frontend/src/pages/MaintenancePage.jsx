
import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Button, Field, Notice, PageHeading, StatusBadge, inputClass } from '../components/ui.jsx';
import { money } from '../data/seed.js';
import * as api from '../api.js';

export function MaintenancePage({ vehicles, logs, token, reload }) {
  const [vehicleId, setVehicleId] = useState('');
  const [service, setService] = useState('Scheduled service');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('In Shop');
  const [saved, setSaved] = useState('');

  const save = async () => {
    if (!vehicleId || !cost) return;
    try {
      await api.createMaintenance(token, { vehicleId, service, cost: Number(cost), status });
      await reload();
      setSaved(status === 'In Shop' ? 'Maintenance logged. Vehicle moved to In Shop and removed from dispatch.' : 'Service record saved.');
      setVehicleId('');
      setCost('');
    } catch (err) {
      setSaved(err.message || 'Failed to save maintenance record.');
    }
  };

  const closeLog = async (log) => {
    try {
      await api.closeMaintenance(token, log._id || log.id);
      await reload();
      setSaved('Service closed. Vehicle restored to Available.');
    } catch (err) {
      setSaved(err.message || 'Failed to close service.');
    }
  };

  return (
    <>
      <PageHeading eyebrow="Fleet care" title="Maintenance" description="Record services and control vehicle dispatch eligibility." />
      {saved && <div className="mb-4"><Notice kind="success">{saved}</Notice></div>}
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4">
          <h2 className="text-sm font-semibold">Log service record</h2>
          <div className="mt-5 space-y-4">
            <Field label="Vehicle"><select className={inputClass} value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}><option value="">Select vehicle</option>{vehicles.filter((vehicle) => vehicle.status !== 'Retired').map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.regNo} · {vehicle.model}</option>)}</select></Field>
            <Field label="Service type"><input className={inputClass} value={service} onChange={(event) => setService(event.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="Cost (₹)"><input className={inputClass} type="number" value={cost} onChange={(event) => setCost(event.target.value)} /></Field><Field label="Status"><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option>In Shop</option><option>Completed</option></select></Field></div>
            <Button onClick={save} disabled={!vehicleId || !cost}>Save record</Button>
          </div>
        </section>
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4">
          <h2 className="text-sm font-semibold">Service log</h2>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[600px] text-left"><thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500"><tr>{['Vehicle', 'Service type', 'Cost', 'Date', 'Status', ''].map((header) => <th key={header} className="px-3 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-b border-[#27272a] text-xs"><td className="px-3 py-3 font-mono">{log.vehicleRegNo || vehicles.find((vehicle) => vehicle.id === log.vehicleId)?.regNo}</td><td className="px-3 py-3">{log.service}</td><td className="px-3 py-3">{money(log.cost)}</td><td className="px-3 py-3 text-zinc-400">{log.date}</td><td className="px-3 py-3"><StatusBadge status={log.status} /></td><td className="px-3 py-3">{log.status === 'In Shop' && <button className="text-[11px] font-medium text-[#e6a25e] hover:underline" onClick={() => closeLog(log)}>Close service</button>}</td></tr>)}</tbody></table></div>
          <div className="mt-6 rounded-md border border-[#343438] bg-[#151517] p-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">State transition</p><div className="flex items-center gap-3 text-xs"><span className="rounded bg-emerald-500/10 px-2 py-1 text-emerald-300">Available</span><ArrowLeftRight className="h-4 w-4 text-[#d98a3d]" /><span className="rounded bg-amber-500/10 px-2 py-1 text-amber-300">In Shop</span></div><p className="mt-3 text-[11px] leading-5 text-zinc-500">An active service automatically sets the vehicle to In Shop. Closing it restores Available unless the vehicle is Retired.</p></div>
        </section>
      </div>
    </>);

}