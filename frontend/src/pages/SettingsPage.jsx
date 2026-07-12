
import React, { useState } from 'react';
import { Check, Minus } from 'lucide-react';
import { Button, Field, Notice, PageHeading, inputClass } from '../components/ui.jsx';

const permissions = [
['Dashboard', 'full', 'full', 'view', 'view'],
['Fleet', 'full', '—', 'view', '—'],
['Drivers', 'full', '—', 'full', '—'],
['Trips', 'full', 'full', 'view', '—'],
['Fuel & Expenses', 'full', '—', '—', 'full'],
['Analytics', 'full', 'view', 'view', 'full']];


export function SettingsPage() {
  const [depot, setDepot] = useState('Gandhinagar Depot');
  const [currency, setCurrency] = useState('INR (₹)');
  const [unit, setUnit] = useState('Kilometres (km)');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSaved(true);
    }, 450);
  };

  return (
    <>
      <PageHeading
        eyebrow="Administration"
        title="Settings & RBAC"
        description="Configure depot defaults and inspect role-based module permissions." />
      
      {saved && <div className="mb-4"><Notice kind="success">Changes saved for {depot}.</Notice></div>}
      <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4">
          <h2 className="text-sm font-semibold">General</h2>
          <p className="mt-1 text-[10px] text-zinc-500">Operational defaults for this workspace.</p>
          <div className="mt-5 space-y-4">
            <Field label="Depot name"><input className={inputClass} value={depot} onChange={(event) => setDepot(event.target.value)} /></Field>
            <Field label="Currency"><select className={inputClass} value={currency} onChange={(event) => setCurrency(event.target.value)}><option>INR (₹)</option><option>USD ($)</option></select></Field>
            <Field label="Distance unit"><select className={inputClass} value={unit} onChange={(event) => setUnit(event.target.value)}><option>Kilometres (km)</option><option>Miles (mi)</option></select></Field>
            <Button onClick={save} loading={loading}>Save changes</Button>
          </div>
        </section>
        <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]">
          <div className="border-b border-[#2a2a2d] px-4 py-3.5">
            <h2 className="text-sm font-semibold">Role-based access control</h2>
            <p className="mt-1 text-[10px] text-zinc-500">Module-level permissions by operational role.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-center">
              <thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Module</th>
                  {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map((role) => <th key={role} className="px-3 py-3 font-medium">{role}</th>)}
                </tr>
              </thead>
              <tbody>
                {permissions.map(([module, ...values]) =>
                <tr key={module} className="border-b border-[#27272a] text-xs last:border-0">
                    <td className="px-4 py-3 text-left font-medium text-zinc-300">{module}</td>
                    {values.map((value, index) =>
                  <td key={`${module}-${index}`} className="px-3 py-3">
                        {value === 'full' ? <span className="inline-flex items-center gap-1 text-emerald-300"><Check className="h-3.5 w-3.5" />Full</span> : value === 'view' ? <span className="text-sky-300">View</span> : <Minus className="mx-auto h-3.5 w-3.5 text-zinc-600" />}
                      </td>
                  )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>);

}