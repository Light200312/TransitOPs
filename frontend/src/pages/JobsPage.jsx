
import React, { useMemo, useState } from 'react';
import { ArrowRight, Clock3, MapPin, Package, Play, Route, Truck } from 'lucide-react';
import { Button, Notice, PageHeading, StatusBadge } from '../components/ui.jsx';

export function JobsPage({ trips, vehicles, token, reload }) {
  const [startingTripId, setStartingTripId] = useState(null);
  const [message, setMessage] = useState('');
  const assignedTrips = useMemo(() => trips.filter((trip) => trip.driverId && trips.length > 0), [trips]);

  const startTrip = (trip) => {
    if (trip.status !== 'Dispatched') return;
    setStartingTripId(trip.id);
    window.setTimeout(() => {
      setStartingTripId(null);
      setMessage(`${trip.id} has started. Drive safely and follow the planned route.`);
    }, 400);
  };

  return (
    <>
      <PageHeading eyebrow="Driver workspace" title="My jobs" description={`Rakesh Patel · ${assignedTrips.length} assigned delivery ${assignedTrips.length === 1 ? 'job' : 'jobs'}`} />
      {message && <div className="mb-4"><Notice kind="success">{message}</Notice></div>}
      <section aria-labelledby="assigned-jobs-heading">
        <div className="mb-3 flex items-center justify-between"><div><h2 id="assigned-jobs-heading" className="text-sm font-semibold">Assigned deliveries</h2><p className="mt-1 text-[10px] text-zinc-500">Only work assigned to you is visible here.</p></div><span className="rounded-full border border-[#343438] bg-[#151517] px-2.5 py-1 text-[10px] font-semibold text-zinc-400">Driver ID · D1</span></div>
        <div className="grid gap-4 xl:grid-cols-2">
          {assignedTrips.map((trip) => {
            const vehicle = vehicles.find((item) => item.id === trip.vehicleId);
            return <article key={trip.id} className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs text-[#e6a25e]">{trip.id}</p><div className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#edeae3]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d98a3d]" /><span>{trip.source}<ArrowRight className="mx-1 inline h-3.5 w-3.5 text-zinc-600" />{trip.destination}</span></div></div><StatusBadge status={trip.status} /></div>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-[#2a2a2d] py-4 text-xs">
                <div><dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><Truck className="h-3.5 w-3.5" />Vehicle</dt><dd className="mt-1.5 font-mono text-zinc-200">{vehicle?.regNo ?? 'Vehicle pending'}</dd><dd className="mt-0.5 text-[11px] text-zinc-500">{vehicle?.model}</dd></div>
                <div><dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><Package className="h-3.5 w-3.5" />Cargo</dt><dd className="mt-1.5 font-medium text-zinc-200">{trip.cargo.toLocaleString('en-IN')} kg</dd></div>
                <div><dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><Route className="h-3.5 w-3.5" />Distance</dt><dd className="mt-1.5 font-medium text-zinc-200">{trip.distance} km</dd></div>
                <div><dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><Clock3 className="h-3.5 w-3.5" />ETA</dt><dd className="mt-1.5 font-medium text-zinc-200">{trip.eta}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between gap-3"><p className="text-[11px] leading-5 text-zinc-500">{trip.status === 'Dispatched' ? 'Confirm when you are ready to leave.' : trip.status === 'On Trip' ? 'This delivery is now in progress.' : 'No driver action is needed for this job.'}</p>{trip.status === 'Dispatched' && <Button onClick={() => startTrip(trip)} loading={startingTripId === trip.id} className="shrink-0"><Play className="h-3.5 w-3.5" />Start trip</Button>}</div>
            </article>;
          })}
        </div>
        {assignedTrips.length === 0 && <div className="rounded-lg border border-dashed border-[#343438] bg-[#151517] px-4 py-14 text-center"><p className="text-sm font-medium text-zinc-300">No assigned jobs</p><p className="mt-1 text-xs text-zinc-500">New dispatches assigned to you will appear here.</p></div>}
      </section>
    </>);

}