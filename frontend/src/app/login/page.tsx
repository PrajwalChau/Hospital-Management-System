"use client";
import { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]"></div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <HeartPulse className="h-10 w-10 text-[#DC143C]" />
              <span className="font-black text-3xl text-[#003893]">Nepal<span className="text-[#DC143C]">Med</span></span>
            </Link>
            <h1 className="text-2xl font-black text-[#003893]">Welcome back</h1>
            <p className="text-slate-500 font-medium mt-1">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-[#003893] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#003893] outline-none font-medium text-slate-800 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#003893] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#003893] outline-none font-medium text-slate-800 transition-colors" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input type="checkbox" className="rounded" /> Remember me
                </label>
                <a href="#" className="text-sm font-bold text-[#DC143C] hover:text-[#b01030]">Forgot password?</a>
              </div>
              <Link href="/patient" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#003893] hover:bg-[#002870] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#003893]/20 border-b-4 border-[#001850] active:border-b-0 active:translate-y-1">
                Sign In <ArrowRight className="h-5 w-5" />
              </Link>
            </form>
            <div className="mt-6 pt-6 border-t-2 border-slate-100 text-center">
              <p className="text-slate-600 font-medium">Don&apos;t have an account?{' '}
                <Link href="/register" className="font-bold text-[#DC143C] hover:text-[#b01030]">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
