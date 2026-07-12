import React, { useState } from 'react';
import { BusFront, ChevronRight, Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Field, Notice, inputClass } from '../components/ui.jsx';

export function ResetPassword() {
  const { resetPasswordToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:4000/api/auth/reset-password/${resetPasswordToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong.');
      setSuccess(data.message || 'Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f10] text-[#edeae3] lg:grid lg:grid-cols-2">
      <section className="hidden bg-[#edeae3] p-12 text-[#171716] lg:flex lg:flex-col xl:p-16">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[#d98a3d]"><BusFront className="h-5 w-5" /></span>
          <span className="text-lg font-semibold">TransitOps</span>
        </div>
        <div className="my-auto max-w-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5b24]">Account recovery</p>
          <h1 className="text-4xl font-semibold tracking-tight">Set Your New<br />Password</h1>
          <p className="mt-5 text-sm leading-6 text-zinc-600">
            Almost there! Choose a strong, unique password to secure your TransitOps account and get back to managing your operations.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-3 border-b border-zinc-300 pb-4">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">✓</span>
              <div>
                <p className="text-sm font-medium text-zinc-400 line-through">Enter your email</p>
                <p className="text-xs text-zinc-400">Completed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-b border-zinc-300 pb-4">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">✓</span>
              <div>
                <p className="text-sm font-medium text-zinc-400 line-through">Check your inbox</p>
                <p className="text-xs text-zinc-400">Completed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#d98a3d] text-[10px] font-bold text-white">3</span>
              <div>
                <p className="text-sm font-medium">Set a new password</p>
                <p className="text-xs text-zinc-500">Choose a strong, unique password</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-500">© 2026 TransitOps · Gandhinagar, Gujarat</p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-5 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-[#d98a3d] text-[#171312]"><BusFront className="h-4 w-4" /></span>
              <span className="font-semibold">TransitOps</span>
            </div>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d98a3d]">Account recovery</p>
            <h2 className="text-2xl font-semibold">Reset password</h2>
            <p className="mt-2 text-xs text-zinc-500">Enter and confirm your new password below.</p>
          </div>

          {error && <div className="mb-5"><Notice kind="error">{error}</Notice></div>}
          {success && <div className="mb-5"><Notice kind="success">{success}</Notice></div>}

          <div className="space-y-4">
            <Field label="New password">
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                <input
                  className={`${inputClass} pl-9 pr-10`}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  type={showNew ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Field label="Confirm new password">
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
                <input
                  className={`${inputClass} pl-9 pr-10`}
                  value={confirmNewPassword}
                  onChange={(e) => { setConfirmNewPassword(e.target.value); setError(''); }}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>

          <Button loading={loading} className="mt-7 w-full">
            Reset password <ChevronRight className="h-3.5 w-3.5" />
          </Button>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-[#e6a25e] hover:underline"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </button>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-600">
            <ShieldCheck className="h-3 w-3" />Protected with role-based access control
          </p>
        </form>
      </section>
    </main>
  );
}
