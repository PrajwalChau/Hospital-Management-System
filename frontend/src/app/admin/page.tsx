"use client";
import { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, Users, Building2, Stethoscope, ShieldCheck, ShieldX, Trash2, Plus, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

// --- Mock Data ---
const initDoctors = [
  { id: 1, name: 'Dr. Anita Sharma', specialty: 'Cardiology',  hospital: 'Bir Hospital',    nmc: 'NMC-1001', kyc: 'verified', joined: '2024-01-10' },
  { id: 2, name: 'Dr. Bikash Thapa', specialty: 'Neurology',   hospital: 'TUTH',             nmc: 'NMC-1042', kyc: 'pending',  joined: '2024-03-15' },
  { id: 3, name: 'Dr. Sita Poudel',  specialty: 'Pediatrics',  hospital: 'Patan Hospital',   nmc: 'NMC-1087', kyc: 'rejected', joined: '2024-04-02' },
  { id: 4, name: 'Dr. Ram KC',       specialty: 'Orthopedics', hospital: 'Grande Hospital',  nmc: 'NMC-1120', kyc: 'pending',  joined: '2024-05-01' },
];

const initHospitals = [
  { id: 1, name: 'Bir Hospital',          city: 'Kathmandu', beds: 500, kyc: 'verified', joined: '2023-06-01' },
  { id: 2, name: 'TUTH',                  city: 'Kathmandu', beds: 650, kyc: 'verified', joined: '2023-07-15' },
  { id: 3, name: 'Patan Hospital',         city: 'Lalitpur',  beds: 300, kyc: 'pending',  joined: '2024-01-20' },
  { id: 4, name: 'Grande International',   city: 'Kathmandu', beds: 200, kyc: 'pending',  joined: '2024-04-10' },
];

const initPatients = [
  { id: 1, name: 'Ramesh Thapa',   email: 'ramesh@email.com', joined: '2024-02-01', status: 'active' },
  { id: 2, name: 'Sita Rai',       email: 'sita@email.com',   joined: '2024-03-12', status: 'active' },
  { id: 3, name: 'Hari Lama',      email: 'hari@email.com',   joined: '2024-04-05', status: 'inactive' },
];

type KYC = 'verified' | 'pending' | 'rejected';
type Tab = 'overview' | 'doctors' | 'hospitals' | 'patients' | 'kyc';

const KYC_BADGE: Record<KYC, { cls: string; Icon: any; label: string }> = {
  verified: { cls: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle, label: 'Verified' },
  pending:  { cls: 'bg-amber-100  text-amber-700',   Icon: Clock,        label: 'Pending'  },
  rejected: { cls: 'bg-red-100    text-[#DC143C]',   Icon: XCircle,      label: 'Rejected' },
};

export default function AdminPage() {
  const [tab, setTab]           = useState<Tab>('overview');
  const [doctors, setDoctors]   = useState(initDoctors);
  const [hospitals, setHospitals] = useState(initHospitals);
  const [patients]              = useState(initPatients);

  // KYC actions
  const updateDoctorKyc = (id: number, kyc: KYC) =>
    setDoctors(ds => ds.map(d => d.id === id ? { ...d, kyc } : d));
  const updateHospitalKyc = (id: number, kyc: KYC) =>
    setHospitals(hs => hs.map(h => h.id === id ? { ...h, kyc } : h));

  // Remove
  const removeDoctor   = (id: number) => setDoctors(ds => ds.filter(d => d.id !== id));
  const removeHospital = (id: number) => setHospitals(hs => hs.filter(h => h.id !== id));

  // Add doctor (simple prompt-based)
  const addDoctor = () => {
    const name = prompt('Doctor Full Name:');
    const specialty = prompt('Specialty:');
    const nmc = prompt('NMC Number:');
    if (name && specialty && nmc) {
      setDoctors(ds => [...ds, { id: Date.now(), name, specialty, hospital: 'Unassigned', nmc, kyc: 'pending', joined: new Date().toISOString().slice(0,10) }]);
    }
  };

  const addHospital = () => {
    const name = prompt('Hospital Name:');
    const city = prompt('City:');
    const beds = Number(prompt('Total Beds:') || 0);
    if (name && city) {
      setHospitals(hs => [...hs, { id: Date.now(), name, city, beds, kyc: 'pending', joined: new Date().toISOString().slice(0,10) }]);
    }
  };

  const pendingDoctors   = doctors.filter(d => d.kyc === 'pending');
  const pendingHospitals = hospitals.filter(h => h.kyc === 'pending');

  const TABS: { key: Tab; label: string; Icon: any }[] = [
    { key: 'overview',   label: 'Overview',   Icon: Activity     },
    { key: 'doctors',    label: 'Doctors',    Icon: Stethoscope  },
    { key: 'hospitals',  label: 'Hospitals',  Icon: Building2    },
    { key: 'patients',   label: 'Patients',   Icon: Users        },
    { key: 'kyc',        label: 'KYC Queue',  Icon: ShieldCheck  },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]" />

      {/* Header */}
      <header className="bg-[#003893] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <HeartPulse className="h-7 w-7 text-[#DC143C]" />
            <span className="font-black text-xl">Nepal<span className="text-[#DC143C]">Med</span> <span className="text-blue-300 text-sm font-bold">Admin</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {pendingDoctors.length + pendingHospitals.length > 0 && (
              <button onClick={() => setTab('kyc')} className="flex items-center gap-2 px-3 py-1.5 bg-[#DC143C] rounded-xl text-xs font-black animate-pulse">
                ⚠ {pendingDoctors.length + pendingHospitals.length} KYC Pending
              </button>
            )}
            <Link href="/" className="text-sm font-bold text-blue-200 hover:text-white">← Portal</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Bar */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm overflow-x-auto">
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ${tab === key ? 'bg-[#003893] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Icon className="h-4 w-4" />{label}
              {key === 'kyc' && pendingDoctors.length + pendingHospitals.length > 0 && (
                <span className="w-5 h-5 bg-[#DC143C] text-white text-xs rounded-full flex items-center justify-center">
                  {pendingDoctors.length + pendingHospitals.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-3xl font-black text-[#003893] mb-6">Platform Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              {[
                { label: 'Total Doctors',   value: doctors.length,   Icon: Stethoscope, color: 'text-[#003893]', bg: 'bg-[#003893]/10' },
                { label: 'Total Hospitals', value: hospitals.length,  Icon: Building2,   color: 'text-[#DC143C]', bg: 'bg-[#DC143C]/10' },
                { label: 'Total Patients',  value: patients.length,   Icon: Users,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'KYC Pending',     value: pendingDoctors.length + pendingHospitals.length, Icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(({ label, value, Icon, color, bg }) => (
                <div key={label} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
                  <div className={`inline-flex p-3 ${bg} rounded-xl mb-4`}><Icon className={`h-5 w-5 ${color}`} /></div>
                  <p className={`text-4xl font-black ${color}`}>{value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-sm">
                <h3 className="font-black text-[#003893] mb-4">Verified vs Pending</h3>
                {[
                  { label: 'Doctors Verified',   val: doctors.filter(d=>d.kyc==='verified').length,   total: doctors.length,   color: '#003893' },
                  { label: 'Hospitals Verified',  val: hospitals.filter(h=>h.kyc==='verified').length,  total: hospitals.length,  color: '#DC143C' },
                ].map(({ label, val, total, color }) => (
                  <div key={label} className="mb-4">
                    <div className="flex justify-between text-sm font-bold mb-1"><span>{label}</span><span style={{color}}>{val}/{total}</span></div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(val/total)*100}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#003893] text-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => setTab('kyc')} className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                    <ShieldCheck className="h-5 w-5 text-[#DC143C]" /> Review KYC Queue ({pendingDoctors.length + pendingHospitals.length} pending)
                  </button>
                  <button onClick={() => setTab('doctors')} className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                    <Stethoscope className="h-5 w-5" /> Manage Doctors
                  </button>
                  <button onClick={() => setTab('hospitals')} className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
                    <Building2 className="h-5 w-5" /> Manage Hospitals
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCTORS */}
        {tab === 'doctors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-[#003893]">Manage Doctors</h1>
              <button onClick={addDoctor} className="flex items-center gap-2 px-5 py-2.5 bg-[#003893] text-white rounded-xl font-bold hover:bg-[#002870] transition-colors">
                <Plus className="h-4 w-4" /> Add Doctor
              </button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b-2 border-slate-100">
                  <tr>{['Name','Specialty','Hospital','NMC No.','KYC','Joined','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {doctors.map(d => {
                    const b = KYC_BADGE[d.kyc as KYC];
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-black text-[#003893]">{d.name}</td>
                        <td className="px-4 py-3 font-medium text-slate-600">{d.specialty}</td>
                        <td className="px-4 py-3 font-medium text-slate-600">{d.hospital}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{d.nmc}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${b.cls}`}>
                            <b.Icon className="h-3 w-3" />{b.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs font-medium">{d.joined}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {d.kyc !== 'verified' && <button onClick={() => updateDoctorKyc(d.id,'verified')} className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"><ShieldCheck className="h-4 w-4"/></button>}
                            {d.kyc !== 'rejected' && <button onClick={() => updateDoctorKyc(d.id,'rejected')} className="p-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"><ShieldX className="h-4 w-4"/></button>}
                            <button onClick={() => removeDoctor(d.id)} className="p-1.5 bg-red-50 text-[#DC143C] rounded-lg hover:bg-red-100"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOSPITALS */}
        {tab === 'hospitals' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-[#003893]">Manage Hospitals</h1>
              <button onClick={addHospital} className="flex items-center gap-2 px-5 py-2.5 bg-[#003893] text-white rounded-xl font-bold hover:bg-[#002870] transition-colors">
                <Plus className="h-4 w-4" /> Add Hospital
              </button>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b-2 border-slate-100">
                  <tr>{['Name','City','Beds','KYC Status','Joined','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {hospitals.map(h => {
                    const b = KYC_BADGE[h.kyc as KYC];
                    return (
                      <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-black text-[#003893]">{h.name}</td>
                        <td className="px-4 py-3 font-medium text-slate-600">{h.city}</td>
                        <td className="px-4 py-3 font-bold text-slate-700">{h.beds}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${b.cls}`}>
                            <b.Icon className="h-3 w-3" />{b.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs font-medium">{h.joined}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {h.kyc !== 'verified' && <button onClick={() => updateHospitalKyc(h.id,'verified')} className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"><ShieldCheck className="h-4 w-4"/></button>}
                            {h.kyc !== 'rejected' && <button onClick={() => updateHospitalKyc(h.id,'rejected')} className="p-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"><ShieldX className="h-4 w-4"/></button>}
                            <button onClick={() => removeHospital(h.id)} className="p-1.5 bg-red-50 text-[#DC143C] rounded-lg hover:bg-red-100"><Trash2 className="h-4 w-4"/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PATIENTS */}
        {tab === 'patients' && (
          <div>
            <h1 className="text-3xl font-black text-[#003893] mb-6">Registered Patients</h1>
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b-2 border-slate-100">
                  <tr>{['Name','Email','Joined','Status'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-black text-[#003893]">{p.name}</td>
                      <td className="px-4 py-3 text-slate-500">{p.email}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{p.joined}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KYC QUEUE */}
        {tab === 'kyc' && (
          <div>
            <h1 className="text-3xl font-black text-[#003893] mb-6">KYC Verification Queue</h1>
            <div className="space-y-8">
              {/* Pending Doctors */}
              <div>
                <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2"><Stethoscope className="h-5 w-5 text-[#003893]"/>Doctors Awaiting Verification ({pendingDoctors.length})</h2>
                {pendingDoctors.length === 0
                  ? <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 text-center text-slate-400 font-bold">✅ All doctor KYCs are reviewed!</div>
                  : <div className="space-y-3">
                    {pendingDoctors.map(d => (
                      <div key={d.id} className="bg-white rounded-2xl border-2 border-amber-100 p-5 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-black text-[#003893]">{d.name}</p>
                          <p className="text-sm text-slate-500 font-medium">{d.specialty} • NMC: {d.nmc}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Submitted: {d.joined}</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => updateDoctorKyc(d.id,'verified')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                            <CheckCircle className="h-4 w-4"/> Approve
                          </button>
                          <button onClick={() => updateDoctorKyc(d.id,'rejected')} className="flex items-center gap-2 px-4 py-2 bg-[#DC143C] text-white rounded-xl text-sm font-bold hover:bg-[#b01030] transition-colors">
                            <XCircle className="h-4 w-4"/> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>

              {/* Pending Hospitals */}
              <div>
                <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-[#DC143C]"/>Hospitals Awaiting Verification ({pendingHospitals.length})</h2>
                {pendingHospitals.length === 0
                  ? <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 text-center text-slate-400 font-bold">✅ All hospital KYCs are reviewed!</div>
                  : <div className="space-y-3">
                    {pendingHospitals.map(h => (
                      <div key={h.id} className="bg-white rounded-2xl border-2 border-amber-100 p-5 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="font-black text-[#003893]">{h.name}</p>
                          <p className="text-sm text-slate-500 font-medium">{h.city} • {h.beds} beds</p>
                          <p className="text-xs text-slate-400 mt-0.5">Submitted: {h.joined}</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => updateHospitalKyc(h.id,'verified')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                            <CheckCircle className="h-4 w-4"/> Approve
                          </button>
                          <button onClick={() => updateHospitalKyc(h.id,'rejected')} className="flex items-center gap-2 px-4 py-2 bg-[#DC143C] text-white rounded-xl text-sm font-bold hover:bg-[#b01030] transition-colors">
                            <XCircle className="h-4 w-4"/> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
