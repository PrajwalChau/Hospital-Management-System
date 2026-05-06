"use client";
import { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, User, Stethoscope, Building2, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

type Role = 'Patient' | 'Doctor' | 'Hospital' | null;

const ROLES = [
  { key: 'Patient' as Role,  Icon: User,        label: 'Patient',        desc: 'Book appointments & manage health records' },
  { key: 'Doctor' as Role,   Icon: Stethoscope, label: 'Doctor',         desc: 'Manage your schedule, patients & consultations' },
  { key: 'Hospital' as Role, Icon: Building2,   label: 'Hospital Admin', desc: 'Register your facility & manage staff' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]"></div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <HeartPulse className="h-10 w-10 text-[#DC143C]" />
              <span className="font-black text-3xl text-[#003893]">Nepal<span className="text-[#DC143C]">Med</span></span>
            </Link>
            <div className="flex items-center justify-center gap-3 mt-4">
              {[1,2,3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${step >= s ? 'bg-[#003893] border-[#003893] text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{s}</div>
                  {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#003893]' : 'bg-slate-200'}`}></div>}
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">
              {step === 1 ? 'Choose Role' : step === 2 ? 'Your Details' : 'KYC Verification'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-black text-[#003893] mb-2">I am a...</h2>
                <p className="text-slate-500 font-medium mb-6">Select your role on the platform.</p>
                <div className="grid gap-4">
                  {ROLES.map(({ key, Icon, label, desc }) => (
                    <button key={key} onClick={() => setRole(key)}
                      className={`flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all ${role === key ? 'border-[#003893] bg-[#003893]/5 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className={`p-3 rounded-xl ${role === key ? 'bg-[#DC143C] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#003893]">{label}</p>
                        <p className="text-sm text-slate-500 font-medium">{desc}</p>
                      </div>
                      {role === key && <CheckCircle className="h-6 w-6 text-[#003893] shrink-0" />}
                    </button>
                  ))}
                </div>
                <button onClick={() => role && setStep(2)} disabled={!role}
                  className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#DC143C] text-white font-black rounded-xl disabled:opacity-40 hover:bg-[#b01030] transition-all shadow-lg shadow-[#DC143C]/20 border-b-4 border-[#b01030]">
                  Continue as {role ?? '...'} <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-black text-[#003893] mb-6">Your Details</h2>
                <div className="space-y-5">
                  {['Full Name', 'Email Address', 'Password'].map((lbl) => (
                    <div key={lbl}>
                      <label className="block text-sm font-bold text-[#003893] mb-2">{lbl}</label>
                      <input type={lbl === 'Password' ? 'password' : lbl === 'Email Address' ? 'email' : 'text'}
                        placeholder={lbl === 'Full Name' ? 'e.g. Ramesh Thapa' : lbl === 'Email Address' ? 'you@example.com' : 'Min. 8 characters'}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#003893] outline-none font-medium" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 font-bold text-[#003893] border-2 border-[#003893] rounded-xl hover:bg-[#003893]/5">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#DC143C] text-white font-black rounded-xl hover:bg-[#b01030] transition-all shadow-lg border-b-4 border-[#b01030]">
                    Next: KYC <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#DC143C]/10 rounded-xl"><ShieldCheck className="h-7 w-7 text-[#DC143C]" /></div>
                  <div>
                    <h2 className="text-2xl font-black text-[#003893]">KYC Verification</h2>
                    <p className="text-slate-500 font-medium text-sm">Required for {role} registration</p>
                  </div>
                </div>
                <div className="bg-[#003893]/5 border-2 border-[#003893]/20 rounded-2xl p-5 mb-6">
                  <p className="text-sm font-semibold text-[#003893]">🇳🇵 Documents verified within 24 hours by the NepalMed team &amp; Ministry of Health.</p>
                </div>
                {role === 'Doctor' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#003893] mb-2">NMC Registration Number</label>
                      <input placeholder="e.g. NMC-12345" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#003893] outline-none font-medium" />
                    </div>
                    <div className="border-2 border-dashed border-[#003893]/30 rounded-xl p-6 text-center bg-[#003893]/5 cursor-pointer">
                      <p className="text-sm font-bold text-[#003893]">Upload NMC Certificate</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
                {role === 'Hospital' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#003893] mb-2">PAN / VAT Number</label>
                      <input placeholder="e.g. PAN-123456789" className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#003893] outline-none font-medium" />
                    </div>
                    <div className="border-2 border-dashed border-[#003893]/30 rounded-xl p-6 text-center bg-[#003893]/5 cursor-pointer">
                      <p className="text-sm font-bold text-[#003893]">Upload MoHP Approval Document</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG up to 10MB</p>
                    </div>
                  </div>
                )}
                {role === 'Patient' && (
                  <div className="border-2 border-dashed border-[#003893]/30 rounded-xl p-6 text-center bg-[#003893]/5 cursor-pointer">
                    <p className="text-sm font-bold text-[#003893]">Upload Citizenship / National ID</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG up to 10MB</p>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 font-bold text-[#003893] border-2 border-[#003893] rounded-xl hover:bg-[#003893]/5">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <Link href="/patient" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#003893] text-white font-black rounded-xl hover:bg-[#002870] transition-all shadow-lg border-b-4 border-[#001850]">
                    Submit &amp; Enter <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          <p className="text-center mt-6 text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-black text-[#DC143C] hover:text-[#b01030]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
