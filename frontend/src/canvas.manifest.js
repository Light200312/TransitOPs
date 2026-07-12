export const manifest = {
  screens: {
    scr_ez6hkn: { name: "Sign in", route: "/login", position: { "x": 160, "y": 220 } },
    scr_xbdxtt: { name: "Dashboard", route: "/dashboard", state: { "role": "Fleet Manager" }, position: { "x": 160, "y": 2200 } },
    scr_q9szc3: { name: "Fleet", route: "/fleet", state: { "role": "Fleet Manager" }, position: { "x": 160, "y": 4180 } },
    scr_r38z92: { name: "Drivers", route: "/drivers", state: { "role": "Fleet Manager" }, position: { "x": 1560, "y": 4180 } },
    scr_dlecsk: { name: "Trips", route: "/trips", state: { "role": "Fleet Manager" }, position: { "x": 2960, "y": 4180 } },
    scr_lhftyq: { name: "Maintenance", route: "/maintenance", state: { "role": "Fleet Manager" }, position: { "x": 4360, "y": 4180 } },
    scr_73a0ah: { name: "Fuel & Expenses", route: "/expenses", state: { "role": "Fleet Manager" }, position: { "x": 160, "y": 6160 } },
    scr_cgvo6w: { name: "Analytics", route: "/analytics", state: { "role": "Fleet Manager" }, position: { "x": 1560, "y": 6160 } },
    scr_kfhu6w: { name: "Settings & RBAC", route: "/settings", state: { "role": "Fleet Manager" }, position: { "x": 160, "y": 8140 } }
  },
  sections: {
    sec_k5ghlb: { name: "Authentication", x: 0, y: 0, width: 1520, height: 1180 },
    sec_c7r770: { name: "Main Dashboard", x: 0, y: 1980, width: 1520, height: 1180 },
    sec_le3asl: { name: "Fleet Operations", x: 0, y: 3960, width: 5720, height: 1180 },
    sec_wspg9c: { name: "Business Intelligence", x: 0, y: 5940, width: 2920, height: 1180 },
    sec_k2llqa: { name: "Administration", x: 0, y: 7920, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_k5ghlb", children: [
    { kind: "screen", id: "scr_ez6hkn" }]
  },
  { kind: "section", id: "sec_c7r770", children: [
    { kind: "screen", id: "scr_xbdxtt" }]
  },
  { kind: "section", id: "sec_le3asl", children: [
    { kind: "screen", id: "scr_q9szc3" },
    { kind: "screen", id: "scr_r38z92" },
    { kind: "screen", id: "scr_dlecsk" },
    { kind: "screen", id: "scr_lhftyq" }]
  },
  { kind: "section", id: "sec_wspg9c", children: [
    { kind: "screen", id: "scr_73a0ah" },
    { kind: "screen", id: "scr_cgvo6w" }]
  },
  { kind: "section", id: "sec_k2llqa", children: [
    { kind: "screen", id: "scr_kfhu6w" }]
  }]

};