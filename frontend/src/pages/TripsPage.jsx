
import React, { Fragment, useState } from 'react';
import { ArrowRight, CheckCircle2, MapPin, XCircle } from 'lucide-react';
import {
  Button,
  Field,
  Notice,
  PageHeading,
  StatusBadge,
  inputClass } from
'../components/ui.jsx';
import * as api from '../api.js';

export function TripsPage({
  vehicles,
  drivers,
  trips,
  token,
  reload
}) {
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [cargo, setCargo] = useState('');
  const [source, setSource] = useState('Ahmedabad Hub');
  const [destination, setDestination] = useState('Vadodara DC');
  const [distance, setDistance] = useState('112');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'Available');
  const availableDrivers = drivers.filter(
    (driver) => driver.status === 'Available' && driver.expiry >= today
  );
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
  const cargoNumber = Number(cargo);
  const blocked = Boolean(selectedVehicle && cargoNumber > selectedVehicle.capacity);
  const valid = Boolean(vehicleId && driverId && cargoNumber > 0 && source && destination && !blocked);

  const dispatch = async () => {
    if (!valid || !selectedVehicle) return;
    setLoading(true);
    try {
      const trip = await api.createTrip(token, {
        source, destination, vehicleId, driverId, cargo: cargoNumber, distance: Number(distance),
      });
      await reload();
      setMessage(`${trip.id} dispatched. Vehicle and driver are now On Trip.`);
      setVehicleId('');
      setDriverId('');
      setCargo('');
    } catch (err) {
      setMessage(err.message || 'Failed to dispatch trip.');
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (trip, status) => {
    try {
      if (status === 'Completed') {
        await api.completeTrip(token, trip._id);
      } else {
        await api.cancelTrip(token, trip._id);
      }
      await reload();
      setMessage(`${trip.id} ${status.toLowerCase()}; assigned assets restored to Available.`);
    } catch (err) {
      setMessage(err.message || `Failed to ${status.toLowerCase()} trip.`);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="Dispatch centre"
        title="Trip dispatcher"
        description="Assign compliant drivers and available vehicles to live deliveries." />
      
      {message && <div className="mb-4"><Notice kind="success">{message}</Notice></div>}

      <div className="mb-5 flex items-center justify-between gap-1 overflow-x-auto rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-3">
        {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map((step, index) =>
        <Fragment key={step}>
            <div className="flex min-w-max items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${index < 2 ? 'bg-[#d98a3d] text-[#171312]' : 'bg-[#27272a] text-zinc-500'}`}>
                {index + 1}
              </span>
              <span className="text-xs text-zinc-300">{step}</span>
            </div>
            {index < 3 && <ArrowRight className="h-3.5 w-3.5 text-zinc-700" />}
          </Fragment>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4">
          <h2 className="text-sm font-semibold">Live board</h2>
          <p className="mt-1 text-[10px] text-zinc-500">Open and recently completed delivery movements</p>
          <div className="mt-4 space-y-3">
            {trips.map((trip) => {
              const vehicle = vehicles.find((item) => item.id === trip.vehicleId);
              const driver = drivers.find((item) => item.id === trip.driverId);
              return (
                <article key={trip.id} className="rounded-md border border-[#303034] bg-[#151517] p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-[#e6a25e]">{trip.id}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        {trip.source}<ArrowRight className="h-3 w-3 text-zinc-600" />{trip.destination}
                      </p>
                    </div>
                    <StatusBadge status={trip.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{vehicle?.regNo} · {driver?.name}</span><span>{trip.eta}</span>
                  </div>
                  {trip.status === 'Dispatched' &&
                  <div className="mt-3 flex gap-2">
                      <Button className="py-1.5" onClick={() => updateTrip(trip, 'Completed')}>
                        <CheckCircle2 className="h-3 w-3" />Complete
                      </Button>
                      <Button className="py-1.5" variant="danger" onClick={() => updateTrip(trip, 'Cancelled')}>
                        <XCircle className="h-3 w-3" />Cancel
                      </Button>
                    </div>
                  }
                </article>);

            })}
          </div>
        </section>

        <section className="rounded-lg border border-[#2a2a2d] bg-[#1a1a1c] p-4">
          <h2 className="text-sm font-semibold">Create trip</h2>
          <p className="mt-1 text-[10px] text-zinc-500">Only dispatch-eligible assets are listed.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Source"><input className={inputClass} value={source} onChange={(event) => setSource(event.target.value)} /></Field>
            <Field label="Destination"><input className={inputClass} value={destination} onChange={(event) => setDestination(event.target.value)} /></Field>
            <Field label="Available vehicle">
              <select className={inputClass} value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
                <option value="">Select vehicle</option>
                {availableVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.regNo} · {vehicle.capacity.toLocaleString()} kg</option>)}
              </select>
            </Field>
            <Field label="Compliant driver">
              <select className={inputClass} value={driverId} onChange={(event) => setDriverId(event.target.value)}>
                <option value="">Select driver</option>
                {availableDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} · {driver.category}</option>)}
              </select>
            </Field>
            <Field label="Cargo weight (kg)"><input className={inputClass} value={cargo} onChange={(event) => setCargo(event.target.value)} type="number" min="0" placeholder="e.g. 4200" /></Field>
            <Field label="Planned distance (km)"><input className={inputClass} value={distance} onChange={(event) => setDistance(event.target.value)} type="number" min="0" /></Field>
          </div>
          <div className="mt-4">
            {selectedVehicle ?
            blocked ?
            <Notice kind="error">Cargo exceeds {selectedVehicle.regNo}'s capacity by {(cargoNumber - selectedVehicle.capacity).toLocaleString()} kg. Dispatch is blocked.</Notice> :

            <Notice kind="success">Capacity confirmed: {cargoNumber.toLocaleString() || '0'} / {selectedVehicle.capacity.toLocaleString()} kg assigned.</Notice> :

            <Notice>Select an available vehicle to validate cargo capacity.</Notice>}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={dispatch} disabled={!valid} loading={loading}>Dispatch trip</Button>
            <Button variant="secondary" onClick={() => {setVehicleId('');setDriverId('');setCargo('');}}>Cancel</Button>
          </div>
        </section>
      </div>
    </>);

}