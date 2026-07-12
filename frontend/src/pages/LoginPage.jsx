import React, { useEffect, useState } from 'react';
import { BusFront, ChevronRight, Eye, EyeOff, LockKeyhole, Mail, MapPin, Search, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Field, Notice, inputClass } from '../components/ui.jsx';
import * as api from '../api.js';

const roleList = [
  ['Fleet Manager', 'Fleet, maintenance & dispatch'],
  ['Dispatcher', 'Dashboard & trips'],
  ['Safety Officer', 'Drivers & compliance'],
  ['Financial Analyst', 'Fuel, expenses & analytics'],
  ['Driver', 'Assigned jobs only']];

const fallbackCompanyOptions = ['Gujarat Logistics', 'Metro Cargo', 'Swift Freight', 'NorthStar Transport', 'BlueLine Express'];

export function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('ops@transitops.in');
  const [password, setPassword] = useState('transit123');
  const [role, setRole] = useState('Fleet Manager');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [companyOptions, setCompanyOptions] = useState(fallbackCompanyOptions);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;
    setRole(nextRole);
    if (nextRole !== 'Fleet Manager') {
      setCompanyName('');
      setCompanyLocation('');
    }
    setCompanySearch('');
    setShowCompanyDropdown(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isRegister && !name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.includes('@') || password.length < 6) {
      setError('Invalid email or password format (password must be at least 6 characters).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const companyValue = role === 'Fleet Manager' ? companyName.trim() : (companySearch.trim() || companyName.trim());
      const companyLocationValue = role === 'Fleet Manager' ? companyLocation.trim() : '';
      let data;
      if (isRegister) {
        data = await api.register(name.trim(), email, password, role, companyValue, companyLocationValue);
      } else {
        data = await api.login(email, password, role, companyValue, companyLocationValue);
      }
      onLogin(data.token, data.role, data.name, data.companyName || companyValue);
      navigate(data.role === 'Driver' ? '/jobs' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadCompanies = async () => {
      try {
        const data = await api.fetchCompanyOptions();
        if (!ignore) {
          setCompanyOptions(Array.isArray(data) && data.length ? data : fallbackCompanyOptions);
        }
      } catch (error) {
        if (!ignore) {
          setCompanyOptions(fallbackCompanyOptions);
        }
      }
    };

    loadCompanies();
    return () => {
      ignore = true;
    };
  }, []);

  const normalizedQuery = companySearch.trim().toLowerCase();
  const filteredCompanies = [...companyOptions]
    .filter((item) => {
      const value = item.toLowerCase();
      return !normalizedQuery || value.startsWith(normalizedQuery) || value.includes(normalizedQuery);
    })
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(normalizedQuery);
      const bStarts = b.toLowerCase().startsWith(normalizedQuery);
      if (normalizedQuery && aStarts !== bStarts) {
        return aStarts ? -1 : 1;
      }
      return a.localeCompare(b);
    });

  return (
    <main className="min-h-screen bg-[#0f0f10] text-[#edeae3] lg:grid lg:grid-cols-2">
      <section className="hidden bg-[#edeae3] p-12 text-[#171716] lg:flex lg:flex-col xl:p-16">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[#d98a3d]"><BusFront className="h-5 w-5" /></span>
          <span className="text-lg font-semibold">TransitOps</span>
        </div>
        <div className="my-auto max-w-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5b24]">Command centre</p>
          <h1 className="text-4xl font-semibold tracking-tight">Smart Transport<br />Operations Platform</h1>
          <p className="mt-5 text-sm leading-6 text-zinc-600">A single, clear view of every vehicle, driver and delivery movement across your operation.</p>
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">One login, five roles</p>
            <div className="space-y-3">
              {roleList.map(([name, access]) => <div key={name} className="flex items-center justify-between border-b border-zinc-300 pb-3 text-sm"><span className="font-medium">{name}</span><span className="text-xs text-zinc-500">{access}</span></div>)}
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-500">© 2026 TransitOps · Gandhinagar, Gujarat</p>
      </section>
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-10 lg:hidden"><div className="mb-4 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-md bg-[#d98a3d] text-[#171312]"><BusFront className="h-4 w-4" /></span><span className="font-semibold">TransitOps</span></div></div>
          <div className="mb-7">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98a3d]">Secure access</p>
            <h2 className="text-2xl font-semibold">{isRegister ? 'Create account' : 'Welcome back'}</h2>
            <p className="mt-2 text-xs text-zinc-500">{isRegister ? 'Register to access your operations workspace.' : 'Sign in to access your operations workspace.'}</p>
          </div>
          {error && <div className="mb-5"><Notice kind="error">{error}</Notice></div>}
          <div className="space-y-4">
            {isRegister && (
              <Field label="Full name">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError('');
                    }}
                    type="text"
                    placeholder="Enter your name"
                  />
                </div>
              </Field>
            )}
            <Field label="Email address"><div className="relative"><Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" /><input className={`${inputClass} pl-9`} value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} type="email" /></div></Field>
            <Field label="Password"><div className="relative"><LockKeyhole className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" /><input className={`${inputClass} pl-9 pr-10`} value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} type={showPassword ? 'text' : 'password'} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></Field>
            <Field label={isRegister ? 'Register as' : 'Sign in as'}><select className={inputClass} value={role} onChange={handleRoleChange}>{roleList.map(([name]) => <option key={name}>{name}</option>)}</select></Field>
            {isRegister && role === 'Fleet Manager' && (
              <>
                <Field label="Company name">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                    <input
                      className={`${inputClass} pl-9`}
                      value={companyName}
                      onChange={(event) => {
                        setCompanyName(event.target.value);
                        setError('');
                        setShowCompanyDropdown(true);
                      }}
                      onFocus={() => setShowCompanyDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 120)}
                      placeholder="Search or enter company name"
                    />
                    {showCompanyDropdown && filteredCompanies.length > 0 && (
                      <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-[#343438] bg-[#151517] shadow-lg">
                        {filteredCompanies.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="flex w-full items-center px-3 py-2 text-left text-sm text-zinc-200 hover:bg-[#202023]"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setCompanyName(item);
                              setShowCompanyDropdown(false);
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>
                <Field label="Company location">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                    <input className={`${inputClass} pl-9`} value={companyLocation} onChange={(event) => { setCompanyLocation(event.target.value); setError(''); }} placeholder="Enter location" />
                  </div>
                </Field>
              </>
            )}
            {isRegister && role !== 'Fleet Manager' && (
              <Field label="Select company">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={companySearch}
                    onChange={(event) => {
                      setCompanySearch(event.target.value);
                      setShowCompanyDropdown(true);
                    }}
                    onFocus={() => setShowCompanyDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 120)}
                    placeholder="Search company by name"
                  />
                  {showCompanyDropdown && filteredCompanies.length > 0 && (
                    <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-[#343438] bg-[#151517] shadow-lg">
                      {filteredCompanies.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="flex w-full items-center px-3 py-2 text-left text-sm text-zinc-200 hover:bg-[#202023]"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setCompanySearch(item);
                            setShowCompanyDropdown(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>
            )}
          </div>
          {!isRegister && (
            <div className="mt-5 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-zinc-400">
                <input type="checkbox" className="accent-[#d98a3d]" defaultChecked />Remember me
              </label>
              <button type="button" className="text-[#e6a25e] hover:underline">Forgot password?</button>
            </div>
          )}
          <Button loading={loading} className="mt-7 w-full">
            {isRegister ? 'Register with TransitOps' : 'Sign in to TransitOps'} <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-xs text-[#e6a25e] hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-600"><ShieldCheck className="h-3 w-3" />Protected with role-based access control</p>
        </form>
      </section>
    </main>
  );
}