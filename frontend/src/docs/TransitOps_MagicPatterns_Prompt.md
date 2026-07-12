# Magic Patterns Prompt — TransitOps: Smart Transport Operations Platform

## Project Overview

Build a responsive, dark-themed web application called **TransitOps** — a fleet operations platform for logistics companies to manage vehicles, drivers, trip dispatching, maintenance, and fuel/expense tracking, with role-based access control (RBAC) across four roles: **Fleet Manager, Dispatcher, Safety Officer, Financial Analyst**.

This is a data-dense, internal operations tool (think a logistics back-office SaaS), not a marketing site. Prioritize information density, scanability, and clear status signaling over decorative visuals.

---

## Design System

- **Theme:** Dark mode by default. Near-black background (`#0F0F10`–`#141416`), slightly lighter panel/card surfaces (`#1A1A1C`), subtle 1px borders (`#2A2A2D`).
- **Text:** Off-white/cream primary text (`#EDEAE3`-ish), muted gray secondary text.
- **Accent color:** Warm amber/orange (`#D98A3D`-ish) used for primary buttons, active nav state, and key highlighted metrics. Use sparingly so it pops against the dark background.
- **Status color coding** (use consistently everywhere as pill/badge components):
  - Available / Completed / Active → green
  - On Trip / Dispatched → blue
  - In Shop / Pending / Draft → orange or gray-blue
  - Retired / Suspended / Cancelled / Error → red/pink
- **Typography:** Clean sans-serif, small-to-medium sizes (this is a dense dashboard, not a landing page). Uppercase, letter-spaced labels for table headers and field labels (e.g. "REG NO.", "STATUS").
- **Layout shell:** Persistent left sidebar navigation (collapsible on mobile) + top bar with global search, user name, and a role badge pill (e.g. "Dispatcher"). Content area is a scrollable main panel.
- **Components:** Rounded corners (~6–8px), soft borders instead of heavy shadows, compact data tables with colored status badges, KPI stat cards in a row, small horizontal bar/segment charts for status breakdowns, form fields with clear labels above inputs.

---

## Authentication

**Login screen** — split-screen layout:
- **Left panel** (light/cream background, contrasts with the rest of the dark app): TransitOps logo, product name + tagline ("Smart Transport Operations Platform"), a short "One login, four roles" explainer listing the four roles and what each can access (e.g. Fleet Manager → Fleet, Maintenance; Dispatcher → Dashboard, Trips; Safety Officer → Drivers, Compliance; Financial Analyst → Fuel & Expenses, Analytics).
- **Right panel** (dark): Sign-in form with Email, Password, a Role dropdown (RBAC role selector), "Remember me" checkbox, "Forgot password?" link, and a primary amber "Sign In" button.
- **Error state:** show an inline alert box (red border/text) for invalid credentials, including a warning that the account locks after 5 failed attempts.
- Enforce that only authenticated users can reach any other screen; unauthenticated access redirects to login.

---

## Global Navigation (Sidebar)

Persistent items, with the active item highlighted in amber:
1. Dashboard
2. Fleet (Vehicle Registry)
3. Drivers
4. Trips (Trip Dispatcher)
5. Maintenance
6. Fuel & Expenses
7. Analytics (Reports & Analytics)
8. Settings

Sidebar visibility per item should respect RBAC (e.g. a Dispatcher sees Dashboard/Trips primarily; a Financial Analyst sees Fuel & Expenses/Analytics; still show all items but visually distinguish/gate ones the role can't access, per the Settings RBAC matrix described below).

---

## Page-by-Page Specification

### 1. Dashboard
- Filter row: Vehicle Type, Status, Region dropdowns.
- KPI card row: Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers on Duty, Fleet Utilization (%) — each as a compact stat card with label + large number, colored accents (fleet utilization highlighted in green).
- "Recent Trips" table: Trip ID, Vehicle, Driver, Status badge (On Trip/Completed/Dispatched/Draft), ETA.
- "Vehicle Status" panel: horizontal segmented bar chart showing counts by Available / On Trip / In Shop / Retired, color-coded to match badge colors.

### 2. Vehicle Registry (Fleet)
- Search bar + filters: Type, Status, and a registration-number search field.
- Primary "+ Add Vehicle" button (amber, top right).
- Table columns: Reg No. (unique), Name/Model, Type, Capacity, Odometer, Acquisition Cost, Status (colored badge: Available/On Trip/In Shop/Retired).
- Inline rule note below the table (small red text): registration number must be unique; Retired/In Shop vehicles are hidden from the Trip Dispatcher.

### 3. Drivers & Safety Profiles
- Search + "+ Add Driver" button.
- Table: Driver Name, License No., Category, Expiry Date (flag expired dates visually, e.g. red text), Contact, Trip Completion %, Safety Score %, Status badge (Available/On Trip/Off Duty/Suspended).
- A "Toggle Status" quick-filter row (Available / On Trip / Off Duty / Suspended) for filtering the table.
- Rule note: expired license or Suspended status blocks the driver from trip assignment.

### 4. Trip Dispatcher (Trips)
- Top: horizontal lifecycle stepper — Draft → Dispatched → Completed → Cancelled.
- "Live Board" panel: card list of trips in progress, each showing Trip ID, source → destination, vehicle/driver assigned, status badge, and ETA (or reason if cancelled/awaiting assignment).
- "Create Trip" form: Source, Destination, Vehicle dropdown (only Available vehicles, showing capacity), Driver dropdown (only Available/compliant drivers), Cargo Weight, Planned Distance.
- Live validation panel: shows vehicle capacity vs. cargo weight; green confirmation if within capacity, red blocking error if cargo weight exceeds capacity (dispatch button disabled in that case).
- Actions: "Dispatch" (primary, disabled until valid) and "Cancel".
- Business logic to reflect in UI states: dispatching sets vehicle+driver to On Trip; completing sets both back to Available; cancelling a dispatched trip restores Available.

### 5. Maintenance
- "Log Service Record" form: Vehicle, Service Type, Cost, Date, Status — with a "Save" button (amber).
- "Service Log" table: Vehicle, Service Type, Cost, Status badge (In Shop/Completed).
- A small state-transition diagram: Available ⇄ In Shop, with a note that creating an active maintenance record auto-sets the vehicle to In Shop (removing it from dispatch pool), and closing it restores Available (unless Retired).

### 6. Fuel & Expense Management
- "Fuel Logs" table: Vehicle, Date, Liters, Cost — with "+ Log Fuel" and "+ Add Expense" buttons.
- "Other Expenses (Toll/Misc)" table: Trip, Vehicle, Toll, Other, Maintenance (linked), Total, Status badge.
- Highlighted "Total Operational Cost" summary (Fuel + Maintenance), shown prominently in amber.

### 7. Reports & Analytics
- KPI card row: Fuel Efficiency (km/l), Fleet Utilization (%), Operational Cost, Vehicle ROI (%) — with the ROI formula available as a tooltip: `(Revenue − (Maintenance + Fuel)) / Acquisition Cost`.
- "Monthly Revenue" bar chart (6–7 months).
- "Top Costliest Vehicles" horizontal bar chart, ranked, color-coded by rank.
- Include a CSV export button; PDF export as a secondary/optional action.

### 8. Settings & RBAC
- "General" section: Depot Name, Currency, Distance Unit fields.
- "Role-Based Access Control" matrix table: rows = modules (Dashboard, Fleet, Drivers, Trips, Fuel & Expenses, Analytics), columns = roles (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst), cells = permission indicator (✓ full access / "view" / "—" no access).
- "Save Changes" button (amber).

---

## Data Model (for realistic mock data)

- **Vehicles:** Reg No. (unique), Name/Model, Type, Max Load Capacity, Odometer, Acquisition Cost, Status (Available/On Trip/In Shop/Retired).
- **Drivers:** Name, License No., License Category, License Expiry, Contact, Safety Score, Status (Available/On Trip/Off Duty/Suspended).
- **Trips:** Source, Destination, Vehicle, Driver, Cargo Weight, Planned Distance, Status (Draft/Dispatched/Completed/Cancelled), ETA.
- **Maintenance Logs:** Vehicle, Service Type, Cost, Date, Status.
- **Fuel Logs:** Vehicle, Date, Liters, Cost.
- **Expenses:** Trip, Vehicle, Toll, Other, linked Maintenance cost, Total.
- **Users/Roles:** Name, Role (RBAC), Depot.

Populate each table/screen with realistic seed data (e.g. vehicle types like Van, Truck, Mini; Indian depot names such as Gandhinagar Depot, Ahmedabad Hub, Kalol Depot; costs in ₹).

---

## Key Business Rules to Reflect Visually (not just backend logic)

- Retired or In Shop vehicles never appear in vehicle-selection dropdowns for dispatch.
- Drivers with expired licenses or Suspended status are excluded/disabled from trip assignment dropdowns.
- A vehicle or driver already On Trip cannot be selected for a new trip.
- Cargo weight exceeding vehicle capacity blocks dispatch with a visible red validation message.
- Status changes cascade visibly: Dispatch → vehicle & driver go On Trip; Complete → both go Available; Cancel (from Dispatched) → both restored to Available; Create active maintenance record → vehicle goes In Shop; Close maintenance → vehicle goes Available (unless Retired).

---

## Interaction & State Requirements

- All tables: support search, column filters, and empty states ("No vehicles match your filters").
- All primary actions (Add Vehicle, Add Driver, Dispatch, Save) should show disabled/loading states appropriately.
- Status badges must use the consistent color system across every screen.
- Responsive: sidebar collapses to icons or a drawer on smaller viewports; tables scroll horizontally on mobile.

---

## Deliverable

A clickable, multi-page (or single-page with route/tab-based navigation) React + Tailwind frontend covering all 8 screens above plus the login screen, using mock/seed data, consistent with the dark, amber-accented design system described. No backend integration required — this is a UI/UX prototype layer.
