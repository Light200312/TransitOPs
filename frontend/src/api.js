/**
 * TransitOps API client.
 * Wraps all backend calls and normalises the response shapes so existing
 * components keep working with their current prop contracts (id, vehicleId, etc.).
 */

const BASE = 'http://localhost:3000/api';

/* ───── helpers ───── */

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

/* ───── normalisers (backend → frontend shape) ───── */

const normVehicle = (v) => ({
  ...v,
  id: v._id,
  capacity: Number(v.capacity),
  odometer: Number(v.odometer),
  cost: Number(v.cost),
});

const normDriver = (d) => ({
  ...d,
  id: d._id,
  expiry: d.expiry ? d.expiry.split('T')[0] : d.expiry,
});

const normTrip = (t) => ({
  ...t,
  id: t.tripId,
  _id: t._id,
  vehicleId: typeof t.vehicle === 'object' ? t.vehicle._id : t.vehicle,
  driverId: typeof t.driver === 'object' ? t.driver._id : t.driver,
  vehicleRegNo: typeof t.vehicle === 'object' ? t.vehicle.regNo : undefined,
  driverName: typeof t.driver === 'object' ? t.driver.name : undefined,
});

const normMaintenance = (m) => ({
  ...m,
  id: m._id,
  vehicleId: typeof m.vehicle === 'object' ? m.vehicle._id : m.vehicle,
  vehicleRegNo: typeof m.vehicle === 'object' ? m.vehicle.regNo : undefined,
  date: m.date ? m.date.split('T')[0] : m.date,
});

const normFuelLog = (f) => ({
  ...f,
  id: f._id,
  vehicle: typeof f.vehicle === 'object' ? f.vehicle.regNo : f.vehicle,
  vehicleId: typeof f.vehicle === 'object' ? f.vehicle._id : f.vehicle,
  date: f.date ? f.date.split('T')[0] : f.date,
});

const normExpense = (e) => ({
  ...e,
  id: e._id,
  trip: typeof e.trip === 'object' && e.trip ? e.trip.tripId : (e.trip || ''),
  vehicle: typeof e.vehicle === 'object' ? e.vehicle.regNo : e.vehicle,
  vehicleId: typeof e.vehicle === 'object' ? e.vehicle._id : e.vehicle,
});

/* ───── Auth ───── */

export const login = async (email, password, role) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password, role }),
  });
  return handle(res);
};

export const register = async (name, email, password, role) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, email, password, role }),
  });
  return handle(res);
};

/* ───── Vehicles ───── */

export const fetchVehicles = async (token) => {
  const res = await fetch(`${BASE}/vehicles`, { headers: headers(token) });
  const data = await handle(res);
  return data.map(normVehicle);
};

export const createVehicle = async (token, body) => {
  const res = await fetch(`${BASE}/vehicles`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return normVehicle(await handle(res));
};

/* ───── Drivers ───── */

export const fetchDrivers = async (token) => {
  const res = await fetch(`${BASE}/drivers`, { headers: headers(token) });
  const data = await handle(res);
  return data.map(normDriver);
};

export const createDriver = async (token, body) => {
  const res = await fetch(`${BASE}/drivers`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return normDriver(await handle(res));
};

/* ───── Trips ───── */

export const fetchTrips = async (token) => {
  const res = await fetch(`${BASE}/trips`, { headers: headers(token) });
  const data = await handle(res);
  return data.map(normTrip);
};

export const createTrip = async (token, body) => {
  const res = await fetch(`${BASE}/trips`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return normTrip(await handle(res));
};

export const completeTrip = async (token, id) => {
  const res = await fetch(`${BASE}/trips/${id}/complete`, {
    method: 'PATCH',
    headers: headers(token),
  });
  return normTrip(await handle(res));
};

export const cancelTrip = async (token, id) => {
  const res = await fetch(`${BASE}/trips/${id}/cancel`, {
    method: 'PATCH',
    headers: headers(token),
  });
  return normTrip(await handle(res));
};

/* ───── Maintenance ───── */

export const fetchMaintenance = async (token) => {
  const res = await fetch(`${BASE}/maintenance`, { headers: headers(token) });
  const data = await handle(res);
  return data.map(normMaintenance);
};

export const createMaintenance = async (token, body) => {
  const res = await fetch(`${BASE}/maintenance`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return normMaintenance(await handle(res));
};

export const closeMaintenance = async (token, id) => {
  const res = await fetch(`${BASE}/maintenance/${id}/close`, {
    method: 'PATCH',
    headers: headers(token),
  });
  return normMaintenance(await handle(res));
};

/* ───── Fuel & Expenses ───── */

export const fetchFuelLogs = async (token) => {
  const res = await fetch(`${BASE}/finance/fuel`, { headers: headers(token) });
  const data = await handle(res);
  return data.map(normFuelLog);
};

export const createFuelLog = async (token, body) => {
  const res = await fetch(`${BASE}/finance/fuel`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return normFuelLog(await handle(res));
};

export const fetchExpenses = async (token) => {
  const res = await fetch(`${BASE}/finance/expenses`, { headers: headers(token) });
  const data = await handle(res);
  return data.map(normExpense);
};

export const createExpense = async (token, body) => {
  const res = await fetch(`${BASE}/finance/expenses`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  return normExpense(await handle(res));
};

/* ───── Analytics ───── */

export const fetchAnalytics = async (token) => {
  const res = await fetch(`${BASE}/finance/analytics`, { headers: headers(token) });
  return handle(res);
};
