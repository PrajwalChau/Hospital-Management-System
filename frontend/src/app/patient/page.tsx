"use client";
import Link from 'next/link';
import { HeartPulse, Calendar, FileText, MapPin, Bell, User, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const appointments = [
  { doctor: 'Dr. Anita Sharma', dept: 'Cardiology',  time: '10:00 AM', date: 'Today',     status: 'upcoming' },
  { doctor: 'Dr. Bikash Thapa', dept: 'General',     time: '02:30 PM', date: 'May 8',     status: 'scheduled' },
  { doctor: 'Dr. Sita Poudel',  dept: 'Dermatology', time: '11:00 AM', date: 'May 3',     status: 'done' },
];

const STATUS = {
  upcoming:  { label: 'Upcoming',  cls: 'bg-[#003893]/10 text-[#003893]', Icon: Clock },
  scheduled: { label: 'Scheduled', cls: 'bg-emerald-50 text-emerald-700',  Icon: CheckCircle },
  done:      { label: 'Completed', cls: 'bg-slate-100 text-slate-500',     Icon: CheckCircle },
};

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]"></div>

      {/* Header */}
      <header className="bg-[#003893] text-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <HeartPulse className="h-7 w-7 text-[#DC143C]" />
            <span className="font-black text-xl">Nepal<span className="text-[#DC143C]">Med</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-blue-200">
            <a href="#" className="text-white border-b-2 border-[#DC143C] pb-0.5">Overview</a>
            <a href="#" className="hover:text-white">My Appointments</a>
            <a href="#" className="hover:text-white">Health Records</a>
            <Link href="/hospitals" className="hover:text-white">Find Hospital</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-white/10 rounded-lg hover:bg-white/20"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-[#DC143C] rounded-full"></span></button>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-full bg-[#DC143C] flex items-center justify-center text-xs font-black">RT</div>
              <span className="text-sm font-bold hidden sm:block">Ramesh Thapa</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#003893]">Good Morning, Ramesh 👋</h1>
          <p className="text-slate-500 font-medium mt-1">Here&apos;s your health overview for today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upcoming Appointments', value: '2', Icon: Calendar, color: 'text-[#003893]', bg: 'bg-[#003893]/10' },
            { label: 'Medical Reports', value: '7', Icon: FileText, color: 'text-[#DC143C]', bg: 'bg-[#DC143C]/10' },
            { label: 'Nearest Hospital', value: '1.2km', Icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Prescriptions', value: '3', Icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex p-2.5 ${bg} rounded-xl mb-4`}><Icon className={`h-5 w-5 ${color}`} /></div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Appointments */}
          <div className="md:col-span-2 bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[#003893]">My Appointments</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#DC143C] text-white text-sm font-bold rounded-xl hover:bg-[#b01030] transition-colors">
                <Calendar className="h-4 w-4" /> Book New
              </button>
            </div>
            <div className="space-y-3">
              {appointments.map((appt, i) => {
                const s = STATUS[appt.status as keyof typeof STATUS];
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-[#003893]/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-[#003893]/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-[#003893]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800">{appt.doctor}</p>
                      <p className="text-sm text-slate-500 font-medium">{appt.dept} • {appt.date} at {appt.time}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.cls} whitespace-nowrap`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-black text-[#003893] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { label: 'Find Nearest Hospital', href: '/hospitals', Icon: MapPin,   color: 'bg-[#003893]' },
                  { label: 'Book Appointment',       href: '#',          Icon: Calendar, color: 'bg-[#DC143C]' },
                  { label: 'View Health Records',    href: '#',          Icon: FileText, color: 'bg-emerald-600' },
                ].map(({ label, href, Icon, color }) => (
                  <Link key={label} href={href} className={`flex items-center gap-3 p-3.5 ${color} text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}>
                    <Icon className="h-5 w-5" /> {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-[#DC143C]/5 border-2 border-[#DC143C]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-5 w-5 text-[#DC143C]" /><p className="font-black text-[#DC143C] text-sm">Health Reminder</p></div>
              <p className="text-sm text-slate-600 font-medium">Your annual health checkup is due. Book a general consultation today.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
