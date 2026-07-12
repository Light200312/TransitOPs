
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { money } from '../data/seed.js';
import { Button, Notice, PageHeading, StatusBadge } from '../components/ui.jsx';
import * as api from '../api.js';

export function ExpensesPage({ token }) {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(null);
  const [notice, setNotice] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const [fl, ex] = await Promise.all([
        api.fetchFuelLogs(token),
        api.fetchExpenses(token),
      ]);
      setFuelLogs(fl);
      setExpenses(ex);
    } catch (err) {
      console.error('Failed to load expenses data:', err);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const addFuel = async () => {
    setLoading('fuel');
    try {
      // Use the first available vehicle for the demo fuel log
      const vehicles = await api.fetchVehicles(token);
      const vehicle = vehicles.find((v) => v.regNo === 'GJ-01-VB-7724') || vehicles[0];
      if (vehicle) {
        await api.createFuelLog(token, {
          vehicleId: vehicle.id, date: new Date().toISOString().split('T')[0], liters: 48, cost: 4637,
        });
        await fetchData();
        setNotice('Fuel log recorded for ' + vehicle.regNo + '.');
      }
    } catch (err) {
      setNotice(err.message || 'Failed to log fuel.');
    } finally {
      setLoading(null);
    }
  };

  const addExpense = async () => {
    setLoading('expense');
    try {
      const vehicles = await api.fetchVehicles(token);
      const vehicle = vehicles.find((v) => v.regNo === 'GJ-01-KP-4821') || vehicles[0];
      if (vehicle) {
        await api.createExpense(token, {
          vehicleId: vehicle.id, toll: 780, other: 320, maintenance: 0, status: 'Pending',
        });
        await fetchData();
        setNotice('Expense entry added and marked Pending.');
      }
    } catch (err) {
      setNotice(err.message || 'Failed to add expense.');
    } finally {
      setLoading(null);
    }
  };

  const totalFuel = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalMaintenance = expenses.reduce((sum, expense) => sum + expense.maintenance, 0) + 28600;

  return (
    <>
      <PageHeading eyebrow="Cost control" title="Fuel & expense management" description="Track daily operating costs across every fleet movement." action={<div className="flex gap-2"><Button variant="secondary" onClick={addExpense} loading={loading === 'expense'}><Plus className="h-3.5 w-3.5" />Add expense</Button><Button onClick={addFuel} loading={loading === 'fuel'}><Plus className="h-3.5 w-3.5" />Log fuel</Button></div>} />
      {notice && <div className="mb-4"><Notice kind="success">{notice}</Notice></div>}
      <section className="mb-5 rounded-lg border border-[#d98a3d]/30 bg-[#d98a3d]/10 p-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#dca46e]">Total operational cost</p><p className="mt-2 text-3xl font-semibold tracking-tight text-[#f0b77b]">{money(totalFuel + totalMaintenance)}</p><p className="mt-1 text-xs text-[#d7af89]">Fuel {money(totalFuel)} + Maintenance {money(totalMaintenance)}</p></section>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]"><div className="border-b border-[#2a2a2d] px-4 py-3.5"><h2 className="text-sm font-semibold">Fuel logs</h2><p className="mt-1 text-[10px] text-zinc-500">Latest fuel issues by vehicle</p></div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left"><thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500"><tr>{['Vehicle', 'Date', 'Liters', 'Cost'].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{fuelLogs.map((log) => <tr key={log.id} className="border-b border-[#27272a] text-xs last:border-0"><td className="px-4 py-3 font-mono text-zinc-300">{log.vehicle}</td><td className="px-4 py-3 text-zinc-400">{log.date}</td><td className="px-4 py-3">{log.liters} L</td><td className="px-4 py-3">{money(log.cost)}</td></tr>)}</tbody></table></div></section>
        <section className="overflow-hidden rounded-lg border border-[#2a2a2d] bg-[#1a1a1c]"><div className="border-b border-[#2a2a2d] px-4 py-3.5"><h2 className="text-sm font-semibold">Other expenses</h2><p className="mt-1 text-[10px] text-zinc-500">Toll, miscellaneous and linked maintenance costs</p></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="border-b border-[#2a2a2d] text-[10px] uppercase tracking-[0.12em] text-zinc-500"><tr>{['Trip', 'Vehicle', 'Toll', 'Other', 'Maintenance', 'Total', 'Status'].map((header) => <th key={header} className="px-3 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{expenses.map((expense) => {const total = expense.toll + expense.other + expense.maintenance;return <tr key={expense.id} className="border-b border-[#27272a] text-xs last:border-0"><td className="px-3 py-3 font-mono text-[#e6a25e]">{expense.trip}</td><td className="px-3 py-3 font-mono text-zinc-400">{expense.vehicle}</td><td className="px-3 py-3">{money(expense.toll)}</td><td className="px-3 py-3">{money(expense.other)}</td><td className="px-3 py-3">{money(expense.maintenance)}</td><td className="px-3 py-3 font-medium">{money(total)}</td><td className="px-3 py-3"><StatusBadge status={expense.status} /></td></tr>;})}</tbody></table></div></section>
      </div>
    </>);

}