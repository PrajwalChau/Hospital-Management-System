"use client";
import Link from 'next/link';
import { HeartPulse, Bell, Users, Calendar, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';

const todayPatients = [
  { name: 'Sita Rai',    time: '09:00', status: 'done',     reason: 'Follow-up checkup' },
  { name: 'Ram Thapa',   time: '10:30', status: 'progress', reason: 'Chest pain consultation' },
  { name: 'Mina KC',     time: '11:00', status: 'waiting',  reason: 'Routine blood pressure' },
  { name: 'Hari Lama',   time: '11:30', status: 'waiting',  reason: 'Diabetes management' },
  { name: 'Puja Tamang', time: '13:00', status: 'upcoming', reason: 'First consultation' },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  done:     { label: 'Done',        cls: 'bg-slate-100 text-slate-500' },
  progress: { label: 'In Progress', cls: 'bg-[#003893]/10 text-[#003893]' },
  waiting:  { label: 'Waiting',     cls: 'bg-amber-50 text-amber-700' },
  upcoming: { label: 'Upcoming',    cls: 'bg-emerald-50 text-emerald-700' },
};

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]"></div>

      {/* Header */}
      <header className="bg-[#003893] text-white sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <HeartPulse className="h-7 w-7 text-[#DC143C]" />
            <span className="font-black text-xl">Nepal<span className="text-[#DC143C]">Med</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-blue-200">
            <a href="#" className="text-white border-b-2 border-[#DC143C] pb-0.5">My Schedule</a>
            <a href="#" className="hover:text-white">Patients</a>
            <a href="#" className="hover:text-white">Prescriptions</a>
            <a href="#" className="hover:text-white">Reports</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-white/10 rounded-lg hover:bg-white/20">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC143C] rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-[#DC143C] flex items-center justify-center text-xs font-black">AS</div>
              <span className="text-sm font-bold hidden sm:block">Dr. Anita Sharma</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#003893]">Dr. Sharma&apos;s Workspace</h1>
            <p className="text-slate-500 font-medium mt-1">Cardiology • Bir Hospital, Kathmandu</p>
          </div>
          <div className="px-4 py-2 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> NMC Verified
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Patients",  value: '5',  Icon: Users,    color: 'text-[#003893]', bg: 'bg-[#003893]/10' },
            { label: 'Appointments Left', value: '3',  Icon: Calendar, color: 'text-[#DC143C]', bg: 'bg-[#DC143C]/10' },
            { label: 'Avg. Wait Time',    value: '12m', Icon: Clock,   color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed Today',   value: '2',  Icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex p-2.5 ${bg} rounded-xl mb-4`}><Icon className={`h-5 w-5 ${color}`} /></div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Patient Queue */}
          <div className="md:col-span-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[#003893]">Today&apos;s Patient Queue</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">May 6, 2026</span>
            </div>
            <div className="space-y-3">
              {todayPatients.map((p, i) => {
                const s = STATUS[p.status];
                return (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${p.status === 'progress' ? 'border-[#003893]/30 bg-[#003893]/5' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003893] to-[#DC143C] flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-sm">{p.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800">{p.name}</p>
                      <p className="text-sm text-slate-500 font-medium truncate">{p.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-700">{p.time}</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 bg-red-50 text-[#DC143C] rounded-lg hover:bg-red-100 transition-colors">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#003893] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { label: 'Write Prescription',  color: 'bg-[#003893]' },
                  { label: 'Request Lab Test',    color: 'bg-[#DC143C]' },
                  { label: 'Add Patient Notes',   color: 'bg-emerald-600' },
                  { label: 'View Medical History', color: 'bg-purple-600' },
                ].map(({ label, color }) => (
                  <button key={label} className={`w-full flex items-center justify-center gap-2 p-3 ${color} text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#003893] text-white rounded-2xl p-5">
              <p className="font-black mb-1">Ward: Cardiology B3</p>
              <p className="text-sm text-blue-200 font-medium mb-4">Bir Hospital, Kathmandu</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black">12</p>
                  <p className="text-xs text-blue-200 font-bold mt-0.5">Beds Total</p>
                </div>
                <div className="bg-[#DC143C] rounded-xl p-3 text-center">
                  <p className="text-2xl font-black">9</p>
                  <p className="text-xs font-bold mt-0.5 text-red-200">Occupied</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
