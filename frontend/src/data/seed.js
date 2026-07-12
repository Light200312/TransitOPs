
export const seedVehicles = [
{ id: 'v1', regNo: 'GJ-01-KP-4821', model: 'Tata Prima 5530', type: 'Truck', capacity: 18000, odometer: 128430, cost: 2850000, status: 'On Trip', region: 'Ahmedabad Hub' },
{ id: 'v2', regNo: 'GJ-18-AT-9034', model: 'Mahindra Blazo X', type: 'Truck', capacity: 12000, odometer: 84560, cost: 2120000, status: 'Available', region: 'Gandhinagar Depot' },
{ id: 'v3', regNo: 'GJ-01-RX-2190', model: 'Tata Ace Gold', type: 'Mini', capacity: 750, odometer: 41820, cost: 585000, status: 'Available', region: 'Kalol Depot' },
{ id: 'v4', regNo: 'GJ-27-MN-5518', model: 'Eicher Pro 2049', type: 'Truck', capacity: 6000, odometer: 102900, cost: 1490000, status: 'In Shop', region: 'Ahmedabad Hub' },
{ id: 'v5', regNo: 'GJ-01-VB-7724', model: 'Force Traveller', type: 'Van', capacity: 1400, odometer: 64300, cost: 890000, status: 'Available', region: 'Gandhinagar Depot' },
{ id: 'v6', regNo: 'GJ-18-PE-3320', model: 'Ashok Leyland Dost', type: 'Mini', capacity: 1250, odometer: 178200, cost: 530000, status: 'Retired', region: 'Kalol Depot' }];


export const seedDrivers = [
{ id: 'd1', name: 'Rakesh Patel', license: 'GJ-01-20120219876', category: 'HMV', expiry: '2028-04-11', contact: '+91 98254 11872', completion: 98, safety: 94, status: 'On Trip' },
{ id: 'd2', name: 'Nitin Shah', license: 'GJ-18-20150644210', category: 'HMV', expiry: '2027-09-23', contact: '+91 99041 88413', completion: 96, safety: 91, status: 'Available' },
{ id: 'd3', name: 'Jignesh Prajapati', license: 'GJ-01-20180990841', category: 'LMV', expiry: '2026-11-18', contact: '+91 98989 45231', completion: 93, safety: 88, status: 'Available' },
{ id: 'd4', name: 'Kiran Solanki', license: 'GJ-27-20140433211', category: 'HMV', expiry: '2025-02-09', contact: '+91 97248 90672', completion: 87, safety: 72, status: 'Suspended' },
{ id: 'd5', name: 'Mahesh Vaghela', license: 'GJ-18-20161344562', category: 'LMV', expiry: '2027-01-05', contact: '+91 98791 31026', completion: 91, safety: 84, status: 'Off Duty' },
{ id: 'd6', name: 'Vikram Singh', license: 'GJ-01-20190566321', category: 'HMV', expiry: '2029-08-22', contact: '+91 99042 11234', completion: 99, safety: 97, status: 'Available' },
{ id: 'd7', name: 'Amit Desai', license: 'GJ-27-20150899441', category: 'LMV', expiry: '2025-05-10', contact: '+91 97241 88765', completion: 85, safety: 78, status: 'Off Duty' },
{ id: 'd8', name: 'Sanjay Joshi', license: 'GJ-18-20220133980', category: 'HMV', expiry: '2030-01-15', contact: '+91 98980 66543', completion: 94, safety: 92, status: 'On Trip' },
{ id: 'd9', name: 'Deepak Chauhan', license: 'GJ-01-20170788123', category: 'HMV', expiry: '2028-12-01', contact: '+91 98765 43210', completion: 96, safety: 90, status: 'Available' },
{ id: 'd10', name: 'Harish Rathod', license: 'GJ-27-20130255674', category: 'HMV', expiry: '2027-06-30', contact: '+91 99120 55678', completion: 89, safety: 81, status: 'On Trip' },
{ id: 'd11', name: 'Pranav Trivedi', license: 'GJ-18-20200411298', category: 'LMV', expiry: '2029-03-14', contact: '+91 97890 12345', completion: 92, safety: 89, status: 'Available' },
{ id: 'd12', name: 'Bhavesh Makwana', license: 'GJ-01-20160977541', category: 'HMV', expiry: '2026-08-20', contact: '+91 98410 77890', completion: 88, safety: 76, status: 'Suspended' },
{ id: 'd13', name: 'Rajesh Parmar', license: 'GJ-27-20210344567', category: 'LMV', expiry: '2030-11-05', contact: '+91 99870 33456', completion: 95, safety: 93, status: 'Off Duty' },
{ id: 'd14', name: 'Suresh Gohel', license: 'GJ-18-20190622890', category: 'HMV', expiry: '2028-07-18', contact: '+91 98230 99876', completion: 90, safety: 85, status: 'Available' }];


export const seedTrips = [
{ id: 'TRP-24081', source: 'Ahmedabad Hub', destination: 'Vadodara DC', vehicleId: 'v1', driverId: 'd1', status: 'Dispatched', eta: 'Today, 18:40', cargo: 14200, distance: 112 },
{ id: 'TRP-24080', source: 'Gandhinagar Depot', destination: 'Mehsana', vehicleId: 'v2', driverId: 'd2', status: 'Draft', eta: 'Awaiting dispatch', cargo: 8000, distance: 76 },
{ id: 'TRP-24079', source: 'Kalol Depot', destination: 'Sanand', vehicleId: 'v3', driverId: 'd3', status: 'Completed', eta: 'Today, 11:20', cargo: 620, distance: 48 },
{ id: 'TRP-24078', source: 'Ahmedabad Hub', destination: 'Surat DC', vehicleId: 'v4', driverId: 'd4', status: 'Cancelled', eta: 'Vehicle maintenance', cargo: 5000, distance: 267 }];


export const seedServiceLogs = [
{ id: 'svc1', vehicleId: 'v4', service: 'Brake system overhaul', cost: 28600, date: '2026-07-10', status: 'In Shop' },
{ id: 'svc2', vehicleId: 'v1', service: 'Scheduled oil service', cost: 9800, date: '2026-07-02', status: 'Completed' },
{ id: 'svc3', vehicleId: 'v5', service: 'Tyre rotation', cost: 4200, date: '2026-06-28', status: 'Completed' }];


export const seedFuelLogs = [
{ id: 'fuel1', vehicle: 'GJ-01-KP-4821', date: '2026-07-11', liters: 182, cost: 17560 },
{ id: 'fuel2', vehicle: 'GJ-18-AT-9034', date: '2026-07-10', liters: 132, cost: 12738 },
{ id: 'fuel3', vehicle: 'GJ-01-RX-2190', date: '2026-07-09', liters: 32, cost: 3091 }];


export const seedExpenses = [
{ id: 'exp1', trip: 'TRP-24081', vehicle: 'GJ-01-KP-4821', toll: 1120, other: 450, maintenance: 0, status: 'Pending' },
{ id: 'exp2', trip: 'TRP-24079', vehicle: 'GJ-01-RX-2190', toll: 240, other: 180, maintenance: 4200, status: 'Completed' }];


export const money = (amount) =>
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(amount);