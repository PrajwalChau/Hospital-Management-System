"use client";

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { Activity, Building2, Bed, Users, HeartPulse, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'http://localhost:8000';

// Nepal flag colors
const NP_RED = '#DC143C';
const NP_BLUE = '#003893';
const DEPT_COLORS = [NP_RED, NP_BLUE, '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function GovernmentDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [admissionsTrend, setAdmissionsTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, trendRes] = await Promise.all([
          fetch(`${API_URL}/analytics/government`),
          fetch(`${API_URL}/analytics/admissions_trend`)
        ]);
        setAnalytics(await analyticsRes.json());
        setAdmissionsTrend(await trendRes.json());
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deptData = analytics?.department_distribution
    ? Object.entries(analytics.department_distribution).map(([name, value]) => ({ name, value }))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-[#DC143C] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#003893] font-bold text-lg">Loading Ministry Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top stripe - Nepal flag inspired */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]"></div>

      {/* Header */}
      <header className="bg-[#003893] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="bg-[#DC143C] p-2.5 rounded-xl shadow-md">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight tracking-tight">
                Nepal<span className="text-[#DC143C]">Med</span> — Ministry of Health & Population
              </h1>
              <p className="text-xs text-blue-200 font-semibold tracking-widest uppercase">National Health Monitoring • Live Data</p>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg">
            <ArrowLeft className="h-4 w-4" /> Back to Portal
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#DC143C]/10 border border-[#DC143C]/30 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[#DC143C] shrink-0" />
            <p className="text-sm font-semibold text-[#DC143C]">Could not connect to backend API. Showing sample data. Make sure the FastAPI server is running on port 8000.</p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-[#003893]/20 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hospitals</p>
              <div className="p-2.5 bg-[#003893]/10 rounded-xl group-hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5 text-[#003893]"/>
              </div>
            </div>
            <p className="text-4xl font-black text-[#003893]">{analytics?.total_hospitals ?? '—'}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> KYC Verified
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-[#DC143C]/20 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Beds</p>
              <div className="p-2.5 bg-[#DC143C]/10 rounded-xl group-hover:scale-110 transition-transform">
                <Bed className="h-5 w-5 text-[#DC143C]"/>
              </div>
            </div>
            <p className="text-4xl font-black text-[#003893]">{analytics?.total_beds?.toLocaleString() ?? '—'}</p>
            <p className="text-xs font-semibold text-slate-400 mt-3">Across all national facilities</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Occupancy</p>
              <div className="p-2.5 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5 text-amber-600"/>
              </div>
            </div>
            <p className="text-4xl font-black text-[#003893]">{analytics?.occupancy_rate?.toFixed(1) ?? '—'}%</p>
            <div className="mt-3">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#DC143C] h-full rounded-full transition-all duration-700" style={{ width: `${analytics?.occupancy_rate ?? 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Admissions</p>
              <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-emerald-600"/>
              </div>
            </div>
            <p className="text-4xl font-black text-[#003893]">{analytics?.recent_admissions_count?.toLocaleString() ?? '—'}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-3">+12% from previous 30 days</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          
          {/* Line Chart - Admission Trend */}
          <div className="col-span-1 lg:col-span-3 bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-[#003893] text-lg">National Admission Trend</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">30-Day Rolling Average</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#DC143C]/10 text-[#DC143C] font-bold text-xs">LIVE</div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={admissionsTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: `2px solid ${NP_BLUE}20`, boxShadow: '0 10px 25px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="admissions" stroke={NP_BLUE} strokeWidth={3} dot={{ r: 5, fill: NP_RED, stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 7, fill: NP_RED }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Dept Distribution */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="font-black text-[#003893] text-lg">Department Distribution</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">Admission by Ward Type</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="42%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgb(0 0 0 / 0.1)', fontWeight: 600 }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer credit */}
        <div className="text-center py-6 border-t-2 border-slate-100">
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            NepalMed National Health Platform • Ministry of Health & Population, Government of Nepal
          </p>
        </div>

      </main>
    </div>
  );
}
