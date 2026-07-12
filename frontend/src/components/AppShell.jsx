
import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  BusFront,
  ChevronLeft,
  ClipboardList,
  Fuel,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Users,
  Wrench } from
'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StatusBadge } from './ui.jsx';

const nav = [
{ to: '/jobs', label: 'Jobs', icon: ClipboardList, roles: ['Driver'] },
{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
{ to: '/fleet', label: 'Fleet', icon: BusFront, roles: ['Fleet Manager'] },
{ to: '/drivers', label: 'Drivers', icon: Users, roles: ['Fleet Manager', 'Safety Officer'] },
{ to: '/trips', label: 'Trips', icon: ClipboardList, roles: ['Fleet Manager', 'Dispatcher'] },
{ to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['Fleet Manager'] },
{ to: '/expenses', label: 'Fuel & Expenses', icon: Fuel, roles: ['Fleet Manager', 'Financial Analyst'] },
{ to: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
{ to: '/settings', label: 'Settings', icon: Settings, roles: ['Fleet Manager'] }];


export function AppShell({ role, name, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('transitops-theme') === 'light';
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = isLightTheme ? 'light' : 'dark';
    window.localStorage.setItem('transitops-theme', isLightTheme ? 'light' : 'dark');
  }, [isLightTheme]);

  const visibleNav = role === 'Driver' ? nav.filter((item) => item.roles.includes(role)) : nav;

  const navigation =
  <>
      <div className="flex h-[68px] items-center justify-between border-b border-[#2a2a2d] px-4">
        <Link to={role === 'Driver' ? '/jobs' : '/dashboard'} className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#d98a3d] text-[#171312]">
            <BusFront className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-[#edeae3]">
            Transit<span className="text-[#d98a3d]">Ops</span>
          </span>
        </Link>
        <button
        type="button"
        onClick={() => setOpen(false)}
        className="p-1 text-zinc-400 lg:hidden"
        aria-label="Close navigation">
        
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Primary navigation">
        {visibleNav.map(({ to, label, icon: Icon, roles }) => {
        const gated = !roles.includes(role);

        return (
          <NavLink
            key={to}
            to={to}
            onClick={(event) => {
              if (gated) event.preventDefault();else
              setOpen(false);
            }}
            aria-disabled={gated}
            title={gated ? `Not available for ${role}` : label}
            className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition ${
            gated ?
            'cursor-not-allowed text-zinc-600' :
            isActive ?
            'bg-[#d98a3d]/10 text-[#e6a25e]' :
            'text-zinc-400 hover:bg-[#202023] hover:text-zinc-200'}`

            }>
            
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {gated && <ShieldCheck className="ml-auto h-3.5 w-3.5 opacity-70" />}
            </NavLink>);

      })}
      </nav>

      <div className="border-t border-[#2a2a2d] p-3">
        <button
        type="button"
        onClick={() => {
          onLogout();
          navigate('/login');
        }}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-xs text-zinc-500 hover:bg-[#202023] hover:text-zinc-200">
        
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>;


  return (
    <div className="min-h-screen bg-[#0f0f10] text-[#edeae3]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[#2a2a2d] bg-[#141416] transition-transform lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'}`
        }>
        
        {navigation}
      </aside>

      {open &&
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        aria-label="Close navigation overlay" />

      }

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-[#2a2a2d] bg-[#0f0f10]/95 px-4 backdrop-blur sm:px-7">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-zinc-400 lg:hidden"
            aria-label="Open navigation">
            
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-md border border-[#2a2a2d] bg-[#151517] px-3 py-2 sm:flex">
            <Search className="h-3.5 w-3.5 text-zinc-600" />
            <input
              aria-label="Global search"
              className="w-full bg-transparent text-xs text-zinc-300 outline-none placeholder:text-zinc-600"
              placeholder="Search trips, vehicles, drivers..." />
            
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLightTheme((current) => !current)}
              className="grid h-8 w-8 place-items-center rounded-md border border-[#343438] bg-[#151517] text-zinc-400 transition hover:bg-[#202023] hover:text-[#e6a25e] focus:outline-none focus:ring-2 focus:ring-[#d98a3d]"
              aria-label={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}
              title={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}>
              
              {isLightTheme ?
              <Moon className="h-4 w-4" aria-hidden="true" /> :

              <Sun className="h-4 w-4" aria-hidden="true" />
              }
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-zinc-200">{name}</p>
              <p className="text-[10px] text-zinc-500">Gandhinagar Depot</p>
            </div>

            <StatusBadge status="Active" />
            <span className="rounded-full border border-[#d98a3d]/30 bg-[#d98a3d]/10 px-2 py-1 text-[10px] font-semibold text-[#e6a25e]">
              {role}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-7">{children}</main>
      </div>
    </div>);

}